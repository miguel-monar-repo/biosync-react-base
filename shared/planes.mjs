// Funciones de ayuda para los planes de BioSync. Los planes NO están aquí: viven en MongoDB
// (colección "planes") y se cambian en la base. La API los entrega en GET /api/planes y la web
// los comparte con usePlans(). Cada plan: { id, nombre, precio, descripcion, incluye, perfiles, destacado }.
// Es .mjs (y no .js) por la misma razón que validacionContacto.mjs: Vercel lo cargaría como CommonJS.

// Perfiles de la app: 'sport' (Deportivo), 'senior' (Adulto mayor) y 'kid' (Niño)
export const TODOS_LOS_PERFILES = ['sport', 'senior', 'kid']

export function buscarPlan(planes, id) {
  return planes.find((p) => p.id === id) ?? null
}

export function nombrePlan(planes, id) {
  return buscarPlan(planes, id)?.nombre ?? null
}

// "$3.99" (precios en dólares estadounidenses, la moneda de Ecuador)
export function formatearPrecio(precio) {
  return `$${Number(precio).toFixed(2)}`
}

// Perfiles que puede ver un usuario: los admin ven todos; el resto, los de su plan
// (ninguno si no tiene plan o si su plan ya no está activo)
export function perfilesPermitidos(usuario, planes) {
  if (!usuario) return []
  if (usuario.rol === 'admin') return TODOS_LOS_PERFILES
  return buscarPlan(planes, usuario.plan)?.perfiles ?? []
}
