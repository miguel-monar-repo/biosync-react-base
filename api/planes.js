// Planes de BioSync, leídos de la colección "planes" de MongoDB.
// Para cambiar un precio, una descripción o lo que incluye un plan, se edita en la base
// (Atlas → biosync → planes); el código no cambia. Los planes iniciales los crea
// scripts/cargar-planes.js.
//
// Se guardan en memoria 1 minuto para no consultar la base en cada visita:
// un cambio en la base se ve en la web, en la API y en el chatbot como máximo 1 minuto después.
const CACHE_MS = 60 * 1000

let enCache = null
let cacheHasta = 0

// Lo que la web necesita de cada plan. "codigo" se envía como "id": es el valor que se guarda
// en cada usuario y en cada compra.
const planPublico = (doc) => ({
  id: doc.codigo,
  nombre: doc.nombre,
  precio: doc.precio,
  descripcion: doc.descripcion ?? '',
  incluye: doc.incluye ?? [],
  perfiles: doc.perfiles ?? [],
  destacado: Boolean(doc.destacado),
})

// Recibe la colección "planes" y devuelve los planes activos, en el orden de su campo "orden"
export async function leerPlanes(coleccion) {
  if (enCache && Date.now() < cacheHasta) return enCache

  const docs = await coleccion.find({ activo: true }).sort({ orden: 1 }).toArray()
  enCache = docs.map(planPublico)
  cacheHasta = Date.now() + CACHE_MS
  return enCache
}
