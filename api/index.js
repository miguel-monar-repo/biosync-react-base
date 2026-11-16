// API de BioSync: recibe el formulario de contacto de la landing, maneja el login de la app
// y las rutas del panel de administración. Guarda todo en MongoDB Atlas.
//
// Funciona de dos formas con el mismo código:
//   - En tu computador: `npm run dev` lee el .env de la raíz y escucha en el puerto 4000.
//   - En Vercel: Vercel importa la app (export default) y la convierte en una función.
//     Las variables (MONGODB_URI, FRONTEND_URL...) se configuran en el panel de Vercel.
import { createHash, randomBytes } from 'node:crypto'
import express from 'express'
import { MongoClient, ObjectId } from 'mongodb'
import { validarCompra } from '../shared/validacionCompra.mjs'
import { validarContacto } from '../shared/validacionContacto.mjs'
import { hashContrasena, verificarContrasena } from './contrasenas.js'
import { errorDePlan, validarUsuario } from './usuarios.js'

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
      return {
        contactos: db.collection(process.env.MONGODB_COLLECTION || 'contacts'),
        compras: db.collection('compras'),
        envios,
        usuarios,
        sesiones,
      }
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
    res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
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

// Compra de planes: máximo 5 solicitudes por hora
const limitarCompras = limitarPorIp({
  tipo: 'compra',
  maximo: 5,
  minutos: 60,
  mensaje: 'Has enviado varias solicitudes, intenta más tarde',
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

// Datos del usuario que se envían a la app (nunca la contraseña). Con el plan, la app decide
// qué perfiles mostrar.
const datosPublicos = (usuario) => ({
  email: usuario.email,
  nombre: usuario.nombre,
  rol: usuario.rol,
  plan: usuario.plan ?? null,
})

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

// Solicitud de compra de un plan: { plan, email, celular, consentimiento, website }.
// No crea el usuario: queda en "compras" y el equipo lo crea desde el panel, y le envía
// la contraseña y el método de pago a ese correo.
app.post('/api/compras', limitarCompras, async (req, res) => {
  const cuerpo = req.body || {}

  // Campo trampa, igual que en el formulario de contacto
  if (cuerpo.website) {
    return res.status(201).json({ mensaje: 'Solicitud recibida' })
  }

  const { datos, errores, valido } = validarCompra(cuerpo)
  if (!valido) {
    return res.status(400).json({ errores })
  }

  const { compras } = await conectar()
  await compras.insertOne({ ...datos, atendida: false, creadoEn: new Date() })
  res.status(201).json({ mensaje: 'Solicitud recibida' })
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

// ---------- Panel de administración ----------
// Todas las rutas /api/admin piden sesión Y rol admin. Esta es la protección real:
// ocultar la pantalla en la app no basta, porque cualquiera puede llamar a la API directamente.
function requiereAdmin(req, res, next) {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'No tienes permiso para entrar al panel.' })
  }
  next()
}

app.use('/api/admin', requiereSesion, requiereAdmin)

// Busca el mensaje por su id; responde 404 si el id no es válido o no existe
async function buscarContacto(req, res) {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(404).json({ error: 'No encontramos ese mensaje.' })
    return null
  }
  const { contactos } = await conectar()
  const contacto = await contactos.findOne({ _id: new ObjectId(req.params.id) })
  if (!contacto) res.status(404).json({ error: 'No encontramos ese mensaje.' })
  return contacto
}

// Mensajes del formulario, del más reciente al más antiguo (máximo 500)
app.get('/api/admin/contactos', async (req, res) => {
  const { contactos } = await conectar()
  const lista = await contactos.find().sort({ creadoEn: -1 }).limit(500).toArray()
  res.json({ contactos: lista })
})

// Marcar un mensaje como atendido o pendiente: { atendido: true | false }
app.patch('/api/admin/contactos/:id', async (req, res) => {
  const { atendido } = req.body || {}
  if (typeof atendido !== 'boolean') {
    return res.status(400).json({ error: 'Falta indicar si el mensaje está atendido.' })
  }
  const contacto = await buscarContacto(req, res)
  if (!contacto) return

  const { contactos } = await conectar()
  await contactos.updateOne({ _id: contacto._id }, { $set: { atendido } })
  res.json({ contacto: { ...contacto, atendido } })
})

// Borrar un mensaje (el aviso de datos dice que se pueden borrar)
app.delete('/api/admin/contactos/:id', async (req, res) => {
  const contacto = await buscarContacto(req, res)
  if (!contacto) return

  const { contactos } = await conectar()
  await contactos.deleteOne({ _id: contacto._id })
  res.sendStatus(204)
})

// ---------- Panel: solicitudes de compra ----------

async function buscarCompra(req, res) {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(404).json({ error: 'No encontramos esa solicitud.' })
    return null
  }
  const { compras } = await conectar()
  const compra = await compras.findOne({ _id: new ObjectId(req.params.id) })
  if (!compra) res.status(404).json({ error: 'No encontramos esa solicitud.' })
  return compra
}

// Solicitudes de compra, de la más reciente a la más antigua (máximo 500)
app.get('/api/admin/compras', async (req, res) => {
  const { compras } = await conectar()
  const lista = await compras.find().sort({ creadoEn: -1 }).limit(500).toArray()
  res.json({ compras: lista })
})

// Marcar una solicitud como atendida o pendiente: { atendida: true | false }
app.patch('/api/admin/compras/:id', async (req, res) => {
  const { atendida } = req.body || {}
  if (typeof atendida !== 'boolean') {
    return res.status(400).json({ error: 'Falta indicar si la solicitud está atendida.' })
  }
  const compra = await buscarCompra(req, res)
  if (!compra) return

  const { compras } = await conectar()
  await compras.updateOne({ _id: compra._id }, { $set: { atendida } })
  res.json({ compra: { ...compra, atendida } })
})

app.delete('/api/admin/compras/:id', async (req, res) => {
  const compra = await buscarCompra(req, res)
  if (!compra) return

  const { compras } = await conectar()
  await compras.deleteOne({ _id: compra._id })
  res.sendStatus(204)
})

// ---------- Panel: gestión de usuarios ----------
// Reglas para no quedarse sin acceso al panel: un admin no puede borrarse ni quitarse el rol
// a sí mismo, y siempre debe quedar al menos un admin.
const ERROR_EMAIL_REPETIDO = { email: 'Ya existe un usuario con ese correo.' }

// Datos del usuario que ve el panel (nunca la contraseña)
const usuarioParaPanel = (u) => ({
  _id: u._id,
  email: u.email,
  nombre: u.nombre,
  rol: u.rol,
  plan: u.plan ?? null,
  creadoEn: u.creadoEn,
  actualizadoEn: u.actualizadoEn,
})

const esEmailRepetido = (error) => error?.code === 11000 // índice único de "email"

async function buscarUsuario(req, res) {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(404).json({ error: 'No encontramos ese usuario.' })
    return null
  }
  const { usuarios } = await conectar()
  const usuario = await usuarios.findOne({ _id: new ObjectId(req.params.id) })
  if (!usuario) res.status(404).json({ error: 'No encontramos ese usuario.' })
  return usuario
}

// true si `usuario` es el único admin que queda
async function esUltimoAdmin(usuario) {
  if (usuario.rol !== 'admin') return false
  const { usuarios } = await conectar()
  return (await usuarios.countDocuments({ rol: 'admin' })) <= 1
}

// Lista de usuarios, del más reciente al más antiguo
app.get('/api/admin/usuarios', async (req, res) => {
  const { usuarios } = await conectar()
  const lista = await usuarios.find().sort({ creadoEn: -1 }).toArray()
  res.json({ usuarios: lista.map(usuarioParaPanel) })
})

// Crear usuario: { email, nombre, rol, contrasena }
app.post('/api/admin/usuarios', async (req, res) => {
  const { datos, errores } = validarUsuario(req.body || {}, { nuevo: true })
  if (Object.keys(errores).length > 0) return res.status(400).json({ errores })

  const { usuarios } = await conectar()
  const ahora = new Date()
  const nuevo = {
    email: datos.email,
    nombre: datos.nombre,
    rol: datos.rol,
    plan: datos.rol === 'admin' ? null : datos.plan, // los admin ven todo, no usan plan
    contrasena: await hashContrasena(datos.contrasena),
    creadoEn: ahora,
    actualizadoEn: ahora,
  }
  try {
    const { insertedId } = await usuarios.insertOne(nuevo)
    res.status(201).json({ usuario: usuarioParaPanel({ ...nuevo, _id: insertedId }) })
  } catch (error) {
    if (esEmailRepetido(error)) return res.status(409).json({ errores: ERROR_EMAIL_REPETIDO })
    throw error
  }
})

// Editar usuario: solo los campos que lleguen ({ email, nombre, rol, contrasena }).
// La contraseña vacía o ausente no se cambia.
app.patch('/api/admin/usuarios/:id', async (req, res) => {
  const { datos, errores } = validarUsuario(req.body || {}, { nuevo: false })
  if (Object.keys(errores).length > 0) return res.status(400).json({ errores })
  if (Object.keys(datos).length === 0) return res.status(400).json({ error: 'No hay cambios para guardar.' })

  const usuario = await buscarUsuario(req, res)
  if (!usuario) return

  const esMismo = usuario._id.equals(req.usuario._id)
  if (datos.rol && datos.rol !== usuario.rol) {
    if (esMismo) return res.status(400).json({ errores: { rol: 'No puedes quitarte el rol de admin.' } })
    if (await esUltimoAdmin(usuario)) {
      return res.status(400).json({ errores: { rol: 'Debe quedar al menos un admin.' } })
    }
  }

  // El plan se revisa con cómo queda el usuario: por ejemplo, pasar a "usuario" exige un plan
  const final = { rol: datos.rol ?? usuario.rol, plan: datos.plan !== undefined ? datos.plan : usuario.plan }
  const errorPlan = errorDePlan(final)
  if (errorPlan) return res.status(400).json({ errores: { plan: errorPlan } })

  const cambios = { ...datos, actualizadoEn: new Date() }
  if (final.rol === 'admin') cambios.plan = null // los admin ven todo, no usan plan
  if (datos.contrasena) cambios.contrasena = await hashContrasena(datos.contrasena)

  const { usuarios, sesiones } = await conectar()
  try {
    await usuarios.updateOne({ _id: usuario._id }, { $set: cambios })
  } catch (error) {
    if (esEmailRepetido(error)) return res.status(409).json({ errores: ERROR_EMAIL_REPETIDO })
    throw error
  }

  // Con contraseña nueva se cierran sus otras sesiones (la de quien hace el cambio se mantiene)
  if (datos.contrasena) {
    await sesiones.deleteMany({ usuarioId: usuario._id, tokenHash: { $ne: req.tokenHash } })
  }

  const { contrasena: _omitida, ...sinContrasena } = cambios
  res.json({ usuario: usuarioParaPanel({ ...usuario, ...sinContrasena }) })
})

// Borrar usuario y todas sus sesiones
app.delete('/api/admin/usuarios/:id', async (req, res) => {
  const usuario = await buscarUsuario(req, res)
  if (!usuario) return

  if (usuario._id.equals(req.usuario._id)) {
    return res.status(400).json({ error: 'No puedes borrar tu propio usuario.' })
  }
  if (await esUltimoAdmin(usuario)) {
    return res.status(400).json({ error: 'Debe quedar al menos un admin.' })
  }

  const { usuarios, sesiones } = await conectar()
  await usuarios.deleteOne({ _id: usuario._id })
  await sesiones.deleteMany({ usuarioId: usuario._id })
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
