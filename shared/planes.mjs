// Planes de la app: precio, descripción y qué perfiles de la demo puede ver cada uno.
// Los usan la API (para validar planes de usuarios y compras) y la app (página de planes,
// formulario de compra y qué perfiles mostrar a cada usuario).
// Perfiles de la demo: 'sport' (Deportivo), 'senior' (Adulto mayor) y 'kid' (Niño).
// Es .mjs (y no .js) por la misma razón que validacionContacto.mjs: Vercel lo cargaría como CommonJS.
const TODOS = ['sport', 'senior', 'kid']

// Precios en dólares estadounidenses (USD), la moneda de Ecuador, por mes
export const PLANES_APP = [
  {
    id: 'deportivo',
    nombre: 'Deportivo',
    precio: 3.99,
    descripcion: 'Para quien entrena: pasos, ruta y avisos si algo se detiene.',
    incluye: ['Contador de pasos', 'Ruta por GPS', 'Alerta de caída o inactividad'],
    perfiles: ['sport'],
  },
  {
    id: 'adulto-mayor',
    nombre: 'Adulto mayor',
    precio: 5.99,
    descripcion: 'Caídas, inactividad y ubicación para cuidar a quien vive lejos.',
    incluye: ['Detección de caídas', 'Aviso por inactividad', 'Ubicación y batería'],
    perfiles: ['senior'],
  },
  {
    id: 'nino',
    nombre: 'Niño',
    precio: 4.99,
    descripcion: 'Dónde está y cómo está, mientras juega y explora.',
    incluye: ['Ubicación en tiempo real', 'Mensajes a la familia', 'Nivel de batería'],
    perfiles: ['kid'],
  },
  {
    id: 'familiar',
    nombre: 'Familiar',
    precio: 11.99,
    descripcion: 'Los tres perfiles en una sola cuenta, para toda la familia.',
    incluye: ['Deportivo, Adulto mayor y Niño', 'Alertas por voz y vibración', 'Ahorra frente a pagarlos por separado'],
    perfiles: TODOS,
  },
]

export const ID_PLANES = PLANES_APP.map((p) => p.id)

export function buscarPlan(id) {
  return PLANES_APP.find((p) => p.id === id) ?? null
}

export function nombrePlan(id) {
  return buscarPlan(id)?.nombre ?? null
}

// "$3.99"
export function formatearPrecio(precio) {
  return `$${precio.toFixed(2)}`
}

// Perfiles que puede ver un usuario: los admin ven todos; el resto, los de su plan
// (ninguno si no tiene plan asignado)
export function perfilesPermitidos(usuario) {
  if (!usuario) return []
  if (usuario.rol === 'admin') return TODOS
  return buscarPlan(usuario.plan)?.perfiles ?? []
}
