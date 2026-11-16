// API de BioSync: recibe el formulario de contacto de la landing y maneja el login de la app.
// Guarda todo en MongoDB Atlas.
//
// Funciona de dos formas con el mismo código:
//   - En tu computador: `npm run dev` lee el .env de la raíz y escucha en el puerto 4000.
//   - En Vercel: Vercel importa la app (export default) y la convierte en una función.
//     Las variables (MONGODB_URI, FRONTEND_URL...) se configuran en el panel de Vercel.
import { createHash, randomBytes } from 'node:crypto'
import express from 'express'
import { MongoClient } from 'mongodb'
import { validarContacto } from '../shared/validacionContacto.mjs'
import { hashContrasena, verificarContrasena } from './contrasenas.js'

const EN_VERCEL = Boolean(process.env.VERCEL) // Vercel define VERCEL=1 automáticamente
const PORT = process.env.PORT || 4000

const app = express()
app.use(express.json())

// En Vercel la IP real de la persona llega en la cabecera x-forwarded-for (la pone Vercel).
// En local no hay proxy de confianza, así que no se activa (evita que alguien falsifique su IP).
if (EN_VERCEL) app.set('trust proxy', true)

// ---------- Conexión a MongoDB ----------
// En Vercel no hay un "arranque" del servidor: la conexión se abre con la primera petición
// y se reutiliza en las siguientes mientras la función siga viva.
const client = new MongoClient(process.env.MONGODB_URI)
let conexion

function conectar() {
  if (!conexion) {
    conexion = client.connect().then(async () => {
      const db = client.db(process.env.MONGODB_DB)
      const envios = db.collection('envios')
      const usuarios = db.collection('users')
      const sesiones = db.collection('sesiones')
      // MongoDB borra solo cada registro de envío una hora después de creado (índice TTL)
      await envios.createIndexes([{ key: { creadoEn: 1 }, expireAfterSeconds: 3600 }, { key: { ip: 1, tipo: 1 } }])
      // Un correo no se puede repetir; cada sesión se busca por su token
      await usuarios.createIndexes([{ key: { email: 1 }, unique: true }])
      await sesiones.createIndexes([{ key: { tokenHash: 1 }, unique: true }])
      console.log('Conectado a MongoDB')
      return { contactos: db.collection(process.env.MONGODB_COLLECTION || 'contacts'), envios, usuarios, sesiones }
    })
    // Si falla, se borra para que la siguiente petición lo intente de nuevo
    conexion.catch(() => {
      conexion = undefined
    })
  }
  return conexion
}

// ---------- CORS ----------
// La landing y la API están en dominios distintos, así que el navegador pregunta
// si la API acepta peticiones de la landing. Solo se aceptan los dominios de FRONTEND_URL
// (separados por comas) y, fuera de Vercel, el servidor de desarrollo de Vite.
const ORIGENES_PERMITIDOS = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origen) => origen.trim().replace(/\/$/, ''))
  .filter(Boolean)
if (!EN_VERCEL) ORIGENES_PERMITIDOS.push('http://localhost:5173')

app.use((req, res, next) => {
  const origen = req.headers.origin
  if (origen && ORIGENES_PERMITIDOS.includes(origen)) {
    res.set('Access-Control-Allow-Origin', origen)
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    // Authorization lleva el token de la sesión
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  res.set('Vary', 'Origin')
  // Pregunta previa del navegador (preflight): se responde sin hacer nada más
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// ---------- Límite de peticiones por IP ----------
// Se guarda en MongoDB (colección "envios") porque en Vercel cada petición puede llegar a una
// copia distinta de la función y la memoria no se comparte. "tipo" separa los contadores
// (formulario y login). La IP se guarda como hash (una huella), no tal cual, y cada registro
// se borra solo en una hora, así que la ventana no puede pasar de 60 minutos.
const sha256 = (texto) => createHash('sha256').update(texto).digest('hex')

function limitarPorIp({ tipo, maximo, minutos, mensaje }) {
  return async (req, res, next) => {
    const { envios } = await conectar()
    const ip = sha256(req.ip || 'desconocida')
    const desde = new Date(Date.now() - minutos * 60 * 1000)

    const recientes = await envios.countDocuments({ ip, tipo, creadoEn: { $gt: desde } })
    if (recientes >= maximo) {
      return res.status(429).json({ error: mensaje })
    }

    await envios.insertOne({ ip, tipo, creadoEn: new Date() })
    next()
  }
}

// Formulario: máximo 5 envíos por hora
const limitarEnvios = limitarPorIp({
  tipo: 'contacto',
  maximo: 5,
  minutos: 60,
  mensaje: 'Has enviado varios mensajes, intenta más tarde',
})

// Login: máximo 10 intentos cada 15 minutos (frena a quien pruebe contraseñas al azar)
const limitarLogin = limitarPorIp({
  tipo: 'login',
  maximo: 10,
  minutos: 15,
  mensaje: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
})

// ---------- Sesiones ----------
// Al ingresar se crea un token aleatorio. La app lo guarda y lo envía en la cabecera
// "Authorization: Bearer <token>". En la base solo se guarda su hash: si alguien viera la
// colección "sesiones", no podría usar esos tokens. Las sesiones no vencen: duran hasta cerrar sesión.
const ERROR_LOGIN = 'Correo o contraseña incorrectos.'
// Hash de una contraseña inventada: se usa cuando el correo no existe, para que la respuesta
// tarde lo mismo y no revele qué correos están registrados
const hashFalso = hashContrasena(randomBytes(16).toString('hex'))

// Datos del usuario que se envían a la app (nunca la contraseña)
const datosPublicos = (usuario) => ({ email: usuario.email, nombre: usuario.nombre, rol: usuario.rol })

function leerToken(req) {
  const [tipo, token] = (req.headers.authorization || '').split(' ')
  return tipo === 'Bearer' && token ? token : null
}

// Deja pasar solo si el token es de una sesión válida; deja el usuario en req.usuario
async function requiereSesion(req, res, next) {
  const token = leerToken(req)
  if (!token) return res.status(401).json({ error: 'Debes iniciar sesión.' })

  const { sesiones, usuarios } = await conectar()
  const sesion = await sesiones.findOne({ tokenHash: sha256(token) })
  const usuario = sesion && (await usuarios.findOne({ _id: sesion.usuarioId }))
  if (!usuario) return res.status(401).json({ error: 'Tu sesión ya no es válida. Ingresa de nuevo.' })

  req.usuario = usuario
  req.tokenHash = sesion.tokenHash
  next()
}

// ---------- Rutas ----------
// Para comprobar rápido que la API está publicada (abrir la dirección en el navegador)
app.get('/', (req, res) => {
  res.json({ servicio: 'BioSync API', estado: 'ok' })
})

app.post('/api/contact', limitarEnvios, async (req, res) => {
  const cuerpo = req.body || {}

  // Campo trampa: si un bot lo llenó, respondemos como si todo saliera bien pero no guardamos
  if (cuerpo.website) {
    return res.status(201).json({ mensaje: 'Mensaje recibido' })
  }

  const { datos, errores, valido } = validarContacto(cuerpo)
  if (!valido) {
    return res.status(400).json({ errores })
  }

  const { contactos } = await conectar()
  await contactos.insertOne({ ...datos, atendido: false, creadoEn: new Date() })
  res.status(201).json({ mensaje: 'Mensaje recibido' })
})

// Login: recibe { email, contrasena } y, si coinciden, devuelve { token, usuario }
app.post('/api/login', limitarLogin, async (req, res) => {
  const { email, contrasena } = req.body || {}
  if (typeof email !== 'string' || typeof contrasena !== 'string' || !email.trim() || !contrasena) {
    return res.status(400).json({ error: 'Escribe tu correo y tu contraseña.' })
  }

  const { usuarios, sesiones } = await conectar()
  const usuario = await usuarios.findOne({ email: email.trim().toLowerCase() })
  const correcta = await verificarContrasena(contrasena, usuario ? usuario.contrasena : await hashFalso)
  if (!usuario || !correcta) {
    return res.status(401).json({ error: ERROR_LOGIN })
  }

  const token = randomBytes(32).toString('hex')
  await sesiones.insertOne({ tokenHash: sha256(token), usuarioId: usuario._id, creadoEn: new Date() })
  res.json({ token, usuario: datosPublicos(usuario) })
})

// Revisa si el token sigue siendo válido (la app lo usa al abrirse)
app.get('/api/sesion', requiereSesion, (req, res) => {
  res.json({ usuario: datosPublicos(req.usuario) })
})

// Cerrar sesión: borra la sesión de la base, así ese token deja de servir
app.post('/api/logout', requiereSesion, async (req, res) => {
  const { sesiones } = await conectar()
  await sesiones.deleteOne({ tokenHash: req.tokenHash })
  res.sendStatus(204)
})

// Cualquier error (por ejemplo, MongoDB no responde) termina aquí. Express 5 trae hasta aquí
// también los errores de las funciones async. Solo se imprime el mensaje: el error completo
// de MongoDB puede incluir los datos de la persona.
app.use((error, req, res, next) => {
  console.error('Error en la API:', error.message)
  if (res.headersSent) return next(error)
  res.status(500).json({ error: 'Ocurrió un error en el servidor. Inténtalo de nuevo.' })
})

// En tu computador sí se abre el puerto; en Vercel no hace falta
if (!EN_VERCEL) {
  app.listen(PORT, (error) => {
    if (error) throw error // por ejemplo, el puerto ya está en uso
    console.log(`API en http://localhost:${PORT}`)
  })
}

export default app
