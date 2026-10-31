// API de BioSync. Por ahora solo recibe el formulario de contacto de la landing
// y lo guarda en MongoDB Atlas. La cadena de conexión vive solo aquí (archivo .env en la raíz del proyecto).
import express from 'express'
import { MongoClient } from 'mongodb'
import { validarContacto } from '../shared/validacionContacto.js'

const app = express()
const PORT = process.env.PORT || 4000

const client = new MongoClient(process.env.MONGODB_URI)
let coleccion

app.use(express.json())

// Si en producción el servidor queda detrás de un proxy (Nginx, Render, Railway...),
// activa esto para que req.ip sea la IP real y el límite por IP funcione:
// app.set('trust proxy', 1)

// Máximo 5 envíos por IP cada hora. Se guarda en memoria, así que se reinicia con el servidor.
const LIMITE_ENVIOS = 5
const VENTANA_MS = 60 * 60 * 1000
const enviosPorIp = new Map()

function limitarEnvios(req, res, next) {
  const ahora = Date.now()
  const recientes = (enviosPorIp.get(req.ip) || []).filter((t) => ahora - t < VENTANA_MS)

  if (recientes.length >= LIMITE_ENVIOS) {
    enviosPorIp.set(req.ip, recientes)
    return res.status(429).json({ error: 'Has enviado varios mensajes, intenta más tarde' })
  }

  recientes.push(ahora)
  enviosPorIp.set(req.ip, recientes)
  next()
}

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

  try {
    await coleccion.insertOne({ ...datos, atendido: false, creadoEn: new Date() })
    res.status(201).json({ mensaje: 'Mensaje recibido' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'No se pudo guardar el mensaje' })
  }
})

async function iniciar() {
  await client.connect()
  coleccion = client.db(process.env.MONGODB_DB).collection(process.env.MONGODB_COLLECTION || 'contacts')
  console.log('Conectado a MongoDB')

  app.listen(PORT, (error) => {
    if (error) throw error // por ejemplo, el puerto ya está en uso
    console.log(`API en http://localhost:${PORT}`)
  })
}

iniciar().catch((error) => {
  console.error('Error al conectar a MongoDB:', error)
  process.exit(1)
})
