// Planes de BioSync: la API los lee de MongoDB (colección "planes")
import { apiRequest } from './api.js'

// Devuelve [{ id, nombre, precio, descripcion, incluye, perfiles, destacado }], en orden
export async function fetchPlans() {
  const { planes } = await apiRequest('/api/planes')
  return planes
}
