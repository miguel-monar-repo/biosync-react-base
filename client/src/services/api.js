// Peticiones a la API de BioSync (login y panel de administración).
// En Vercel la API es otro proyecto (VITE_API_URL); en local va vacía y pasa por el proxy de Vite.
const API_URL = import.meta.env.VITE_API_URL || ''
const ERROR_RED = 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'

// Hace la petición y, si la API responde con error, lanza un Error con su mensaje, su estado
// (status 0 = sin conexión) y, si los hay, los errores por campo (`errores`).
// Con `token`, lo envía en la cabecera Authorization.
export async function apiRequest(path, { token, ...options } = {}) {
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
    const message = data.error || (data.errores ? 'Revisa los datos marcados.' : ERROR_RED)
    throw Object.assign(new Error(message), { status: response.status, errores: data.errores })
  }
  return data
}
