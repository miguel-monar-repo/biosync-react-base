// Utilidades para los sensores del teléfono (movimiento y GPS)

// En iPhone hay que pedir permiso para leer el acelerómetro; en Android no.
export async function requestMotionPermission() {
  if (typeof DeviceMotionEvent === 'undefined') return false
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    try {
      const res = await DeviceMotionEvent.requestPermission()
      return res === 'granted'
    } catch {
      return false
    }
  }
  return true
}

// Fuerza total del movimiento a partir de un evento 'devicemotion'.
// Devuelve null si el evento no trae datos.
export function getMotionMagnitude(event) {
  const acc = event.accelerationIncludingGravity || event.acceleration
  if (!acc || acc.x === null) return null
  return Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2)
}

// Distancia en km entre dos coordenadas (fórmula de Haversine)
export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Hora actual en formato "07:52"
export function currentTime() {
  const now = new Date()
  return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
}
