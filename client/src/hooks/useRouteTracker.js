import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext.js'
import { haversineKm } from '../services/sensors.js'

const MAX_JUMP_KM = 0.3 // saltos mayores se ignoran (errores del GPS)

// Distancia y ritmo reales con el GPS mientras se corre o camina.
export function useRouteTracker() {
  const showToast = useToast()
  const [active, setActive] = useState(false)
  const [km, setKm] = useState(0)
  const [pace, setPace] = useState('calculando…')

  useEffect(() => {
    if (!active) return
    // Variables de esta ruta; se reinician cada vez que se activa
    const startTime = Date.now()
    let totalKm = 0
    let lastPos = null

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        if (lastPos) {
          const delta = haversineKm(lastPos.lat, lastPos.lng, latitude, longitude)
          if (delta < MAX_JUMP_KM) totalKm += delta
        }
        lastPos = { lat: latitude, lng: longitude }

        const elapsedMin = (Date.now() - startTime) / 60000
        setKm(totalKm)
        setPace(totalKm > 0.05 && elapsedMin > 0 ? (elapsedMin / totalKm).toFixed(1) + ' min/km' : 'calculando…')
      },
      (err) => {
        showToast('alert', 'No se pudo obtener tu ubicación', err.message || 'Revisa el permiso de ubicación.')
      },
      { enableHighAccuracy: true, maximumAge: 3000 },
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [active, showToast])

  function toggle() {
    if (active) {
      setActive(false)
      showToast('check', 'Seguimiento real detenido', 'La distancia vuelve a ser de ejemplo.')
      return
    }
    if (!navigator.geolocation) {
      showToast('alert', 'GPS no disponible', 'Este navegador no soporta geolocalización.')
      return
    }
    setKm(0)
    setPace('calculando…')
    setActive(true)
    showToast('activity', 'Seguimiento real activado', 'Sal a correr o caminar — tu distancia se calcula con GPS real.')
  }

  return { active, km, pace, toggle }
}
