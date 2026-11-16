// Llamadas a la API para el login de la app
import { apiRequest } from './api.js'

// Devuelve { token, usuario }
export function login(email, password) {
  return apiRequest('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, contrasena: password }),
  })
}

// Devuelve el usuario si el token sigue siendo válido
export async function fetchSession(token) {
  const { usuario } = await apiRequest('/api/sesion', { token })
  return usuario
}

export function logout(token) {
  return apiRequest('/api/logout', { method: 'POST', token })
}
