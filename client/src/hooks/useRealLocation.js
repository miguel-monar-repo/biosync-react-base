import { useEffect, useEffectEvent, useState } from 'react'
import { useFamily } from '../context/FamilyContext.js'
import { useToast } from '../context/ToastContext.js'
import { saveFamilyLocation, subscribeLocation } from '../services/firebase.js'

// Ubicación real por GPS para un perfil ('kid' o 'senior').
// Si la familia está sincronizada, también se envía y se recibe por Firebase.
export function useRealLocation(kind) {
  const showToast = useToast()
  const { isSynced, familyCode } = useFamily()
  const [watching, setWatching] = useState(false)
  const [location, setLocation] = useState({ active: false, lat: null, lng: null })

  const onPosition = useEffectEvent((lat, lng) => {
    setLocation({ active: true, lat, lng })
    if (isSynced) saveFamilyLocation(familyCode, kind, lat, lng).catch(() => {})
  })

  // GPS de este teléfono
  useEffect(() => {
    if (!watching) return
    const watchId = navigator.geolocation.watchPosition(
      (pos) => onPosition(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        showToast('alert', 'No se pudo obtener tu ubicación', err.message || 'Revisa que el permiso de ubicación esté activo.')
      },
      { enableHighAccuracy: true, maximumAge: 5000 },
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [watching, showToast])

  // Ubicación que llega desde el otro teléfono de la familia
  useEffect(() => {
    if (!isSynced) return
    return subscribeLocation(familyCode, kind, (data) => {
      setLocation({ active: true, lat: data.lat, lng: data.lng })
    })
  }, [isSynced, familyCode, kind])

  function toggle() {
    if (location.active) {
      setWatching(false)
      setLocation((l) => ({ ...l, active: false }))
      showToast('check', 'Ubicación real desactivada', 'Volviendo al mapa de ejemplo.')
      return
    }
    if (!navigator.geolocation) {
      showToast('alert', 'GPS no disponible', 'Este navegador no soporta geolocalización.')
      return
    }
    setWatching(true)
  }

  return { ...location, toggle }
}
