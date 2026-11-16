// Llamadas a la API para el login de la app.
// En Vercel la API es otro proyecto (VITE_API_URL); en local va vacía y pasa por el proxy de Vite.
const API_URL = import.meta.env.VITE_API_URL || ''
const ERROR_RED = 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'

// Hace la petición y, si la API responde con error, lanza un Error con su mensaje y su estado
async function request(path, { token, ...options } = {}) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
  } catch {
    throw Object.assign(new Error(ERROR_RED), { status: 0 })
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw Object.assign(new Error(data.error || ERROR_RED), { status: response.status })
  }
  return data
}

// Devuelve { token, usuario }
export function login(email, password) {
  return request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, contrasena: password }),
  })
}

// Devuelve el usuario si el token sigue siendo válido
export async function fetchSession(token) {
  const { usuario } = await request('/api/sesion', { token })
  return usuario
}

export function logout(token) {
  return request('/api/logout', { method: 'POST', token })
}
