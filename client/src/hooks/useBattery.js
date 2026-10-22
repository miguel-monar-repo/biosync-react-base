import { useEffect, useState } from 'react'

// Nivel de batería real del teléfono (0-100), o null si el navegador no lo permite.
// Funciona sobre todo en Chrome / Android.
export function useBattery() {
  const [level, setLevel] = useState(null)

  useEffect(() => {
    if (!navigator.getBattery) return
    let battery = null
    const update = () => setLevel(Math.round(battery.level * 100))

    navigator
      .getBattery()
      .then((b) => {
        battery = b
        update()
        battery.addEventListener('levelchange', update)
      })
      .catch(() => {})

    return () => battery?.removeEventListener('levelchange', update)
  }, [])

  return level
}
