// Llamadas a la API del panel de administración. Usan el token de la sesión guardada;
// la API responde 401 si no hay sesión y 403 si el usuario no es admin.
import { apiRequest } from './api.js'
import { loadAuthToken } from './storage.js'

const adminRequest = (path, options = {}) => apiRequest(path, { ...options, token: loadAuthToken() })

// ---------- Mensajes del formulario de contacto ----------

export async function listContacts() {
  const { contactos } = await adminRequest('/api/admin/contactos')
  return contactos
}

export async function setContactAttended(id, atendido) {
  const { contacto } = await adminRequest(`/api/admin/contactos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ atendido }),
  })
  return contacto
}

export function deleteContact(id) {
  return adminRequest(`/api/admin/contactos/${id}`, { method: 'DELETE' })
}

// ---------- Solicitudes de compra ----------

export async function listPurchases() {
  const { compras } = await adminRequest('/api/admin/compras')
  return compras
}

export async function setPurchaseAttended(id, atendida) {
  const { compra } = await adminRequest(`/api/admin/compras/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ atendida }),
  })
  return compra
}

export function deletePurchase(id) {
  return adminRequest(`/api/admin/compras/${id}`, { method: 'DELETE' })
}

// ---------- Usuarios ----------

export async function listUsers() {
  const { usuarios } = await adminRequest('/api/admin/usuarios')
  return usuarios
}

// datos: { email, nombre, rol, contrasena }
export async function createUser(datos) {
  const { usuario } = await adminRequest('/api/admin/usuarios', { method: 'POST', body: JSON.stringify(datos) })
  return usuario
}

// cambios: solo los campos que cambian; sin contraseña, no se cambia
export async function updateUser(id, cambios) {
  const { usuario } = await adminRequest(`/api/admin/usuarios/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(cambios),
  })
  return usuario
}

export function deleteUser(id) {
  return adminRequest(`/api/admin/usuarios/${id}`, { method: 'DELETE' })
}
