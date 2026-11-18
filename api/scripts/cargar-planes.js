// Crea la colección "planes" en MongoDB con los planes iniciales de BioSync.
// Desde aquí, los planes se cambian en la base (Atlas → biosync → planes), no en el código:
// la web, la API y el chatbot los leen de ahí.
//
// Uso (dentro de api/):  npm run cargar-planes
//
// Solo agrega los planes que todavía no existen (según su "codigo"). Si lo vuelves a ejecutar,
// NO sobrescribe los cambios que hayas hecho en la base (precios, descripciones...).
import { MongoClient } from 'mongodb'

// Precios en dólares estadounidenses (USD), la moneda de Ecuador, por mes.
// Perfiles de la app: 'sport' (Deportivo), 'senior' (Adulto mayor) y 'kid' (Niño).
const PLANES_INICIALES = [
  {
    codigo: 'deportivo',
    nombre: 'Deportivo',
    precio: 3.99,
    descripcion: 'Para quien entrena: pasos, ruta y avisos si algo se detiene.',
    incluye: ['Contador de pasos', 'Ruta por GPS', 'Alerta de caída o inactividad'],
    perfiles: ['sport'],
    destacado: false,
    orden: 1,
  },
  {
    codigo: 'adulto-mayor',
    nombre: 'Adulto mayor',
    precio: 5.99,
    descripcion: 'Caídas, inactividad y ubicación para cuidar a quien vive lejos.',
    incluye: ['Detección de caídas', 'Aviso por inactividad', 'Ubicación y batería'],
    perfiles: ['senior'],
    destacado: false,
    orden: 2,
  },
  {
    codigo: 'nino',
    nombre: 'Niño',
    precio: 4.99,
    descripcion: 'Dónde está y cómo está, mientras juega y explora.',
    incluye: ['Ubicación en tiempo real', 'Mensajes a la familia', 'Nivel de batería'],
    perfiles: ['kid'],
    destacado: false,
    orden: 3,
  },
  {
    codigo: 'familiar',
    nombre: 'Familiar',
    precio: 11.99,
    descripcion: 'Los tres perfiles en una sola cuenta, para toda la familia.',
    incluye: ['Deportivo, Adulto mayor y Niño', 'Alertas por voz y vibración', 'Ahorra frente a pagarlos por separado'],
    perfiles: ['sport', 'senior', 'kid'],
    destacado: true,
    orden: 4,
  },
]

const client = new MongoClient(process.env.MONGODB_URI)
try {
  await client.connect()
  const planes = client.db(process.env.MONGODB_DB).collection('planes')
  // El código de cada plan no se puede repetir (es el que se guarda en usuarios y compras)
  await planes.createIndexes([{ key: { codigo: 1 }, unique: true }, { key: { activo: 1, orden: 1 } }])

  const ahora = new Date()
  for (const plan of PLANES_INICIALES) {
    const { upsertedCount } = await planes.updateOne(
      { codigo: plan.codigo },
      { $setOnInsert: { ...plan, activo: true, creadoEn: ahora, actualizadoEn: ahora } },
      { upsert: true },
    )
    console.log(upsertedCount ? 'Creado:' : 'Ya existía (no se cambió):', plan.codigo)
  }
  console.log('Planes en la base:', await planes.countDocuments())
} finally {
  await client.close()
}
