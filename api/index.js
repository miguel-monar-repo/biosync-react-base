// API de BioSync. Por ahora solo recibe el formulario de contacto de la landing
// y lo guarda en MongoDB Atlas.
//
// Funciona de dos formas con el mismo código:
//   - En tu computador: `npm run dev` lee el .env de la raíz y escucha en el puerto 4000.
//   - En Vercel: Vercel importa la app (export default) y la convierte en una función.
//     Las variables (MONGODB_URI, FRONTEND_URL...) se configuran en el panel de Vercel.
import { createHash } from 'node:crypto'
import express from 'express'
import { MongoClient } from 'mongodb'
import { validarContacto } from '../shared/validacionContacto.mjs'

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
      // MongoDB borra solo cada registro de envío una hora después de creado (índice TTL)
      await envios.createIndexes([{ key: { creadoEn: 1 }, expireAfterSeconds: 3600 }, { key: { ip: 1 } }])
      console.log('Conectado a MongoDB')
      return { contactos: db.collection(process.env.MONGODB_COLLECTION || 'contacts'), envios }
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
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
  }
  res.set('Vary', 'Origin')
  // Pregunta previa del navegador (preflight): se responde sin hacer nada más
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// ---------- Límite de envíos ----------
// Máximo 5 envíos por IP cada hora. Se guarda en MongoDB (colección "envios") porque en Vercel
// cada petición puede llegar a una copia distinta de la función y la memoria no se comparte.
// La IP se guarda como hash (una huella), no tal cual, y el registro se borra solo en una hora.
const LIMITE_ENVIOS = 5
const VENTANA_MS = 60 * 60 * 1000

async function limitarEnvios(req, res, next) {
  const { envios } = await conectar()
  const ip = createHash('sha256').update(req.ip || 'desconocida').digest('hex')
  const desde = new Date(Date.now() - VENTANA_MS)

  const recientes = await envios.countDocuments({ ip, creadoEn: { $gt: desde } })
  if (recientes >= LIMITE_ENVIOS) {
    return res.status(429).json({ error: 'Has enviado varios mensajes, intenta más tarde' })
  }

  await envios.insertOne({ ip, creadoEn: new Date() })
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

// Cualquier error (por ejemplo, MongoDB no responde) termina aquí. Express 5 trae hasta aquí
// también los errores de las funciones async. Solo se imprime el mensaje: el error completo
// de MongoDB puede incluir los datos de la persona.
app.use((error, req, res, next) => {
  console.error('Error en la API:', error.message)
  if (res.headersSent) return next(error)
  res.status(500).json({ error: 'No se pudo guardar el mensaje' })
})

// En tu computador sí se abre el puerto; en Vercel no hace falta
if (!EN_VERCEL) {
  app.listen(PORT, (error) => {
    if (error) throw error // por ejemplo, el puerto ya está en uso
    console.log(`API en http://localhost:${PORT}`)
  })
}

export default app
