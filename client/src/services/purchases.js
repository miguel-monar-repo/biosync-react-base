// Envío del formulario de compra de un plan (ruta pública, no necesita sesión)
import { apiRequest } from './api.js'

// datos: { plan, email, celular, consentimiento, website }
export function sendPurchase(datos) {
  return apiRequest('/api/compras', { method: 'POST', body: JSON.stringify(datos) })
}
