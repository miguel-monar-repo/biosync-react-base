import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext.js'
import { getMotionMagnitude, requestMotionPermission } from '../services/sensors.js'
import { isNewDay, loadTodaySteps, saveTodaySteps } from '../services/storage.js'

const STEP_THRESHOLD = 1.15 // subida mínima de fuerza para contar un paso
const MIN_STEP_GAP_MS = 300 // tiempo mínimo entre dos pasos

// Podómetro real con el acelerómetro del teléfono. Los pasos se guardan por día.
export function useStepCounter() {
  const showToast = useToast()
  const [steps, setSteps] = useState(loadTodaySteps)
  const [active, setActive] = useState(false)

  // Guardar los pasos cada vez que cambian
  useEffect(() => {
    saveTodaySteps(steps)
  }, [steps])

  // Si cambia el día (medianoche), los pasos vuelven a 0
  useEffect(() => {
    const id = setInterval(() => {
      if (isNewDay()) {
        saveTodaySteps(0)
        setSteps(0)
      }
    }, 2600)
    return () => clearInterval(id)
  }, [])

  // Escuchar el sensor solo mientras el podómetro está activo
  useEffect(() => {
    if (!active) return
    let lastMagnitude = 0
    let lastPeakTime = 0

    function handleMotion(event) {
      const magnitude = getMotionMagnitude(event)
      if (magnitude === null) return
      const now = Date.now()
      if (magnitude - lastMagnitude > STEP_THRESHOLD && now - lastPeakTime > MIN_STEP_GAP_MS) {
        lastPeakTime = now
        setSteps((s) => s + 1)
      }
      lastMagnitude = magnitude
    }

    window.addEventListener('devicemotion', handleMotion)
    return () => window.removeEventListener('devicemotion', handleMotion)
  }, [active])

  async function toggle() {
    if (active) {
      setActive(false)
      showToast('check', 'Podómetro real desactivado', 'Los pasos vuelven a ser de ejemplo.')
      return
    }
    const ok = await requestMotionPermission()
    if (!ok) {
      showToast('alert', 'Sensor no disponible', 'No se pudo obtener permiso del sensor de movimiento en este navegador.')
      return
    }
    setActive(true)
    showToast('activity', 'Podómetro real activado', 'Camina con el teléfono en la mano o el bolsillo — cada paso real suma ahora.')
  }

  return { active, steps, toggle }
}
