import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useAlertBanner } from '../context/AlertBannerContext.js'
import { useFamily } from '../context/FamilyContext.js'
import { useToast } from '../context/ToastContext.js'
import { getMotionMagnitude, requestMotionPermission } from '../services/sensors.js'
import { speak, vibrate } from '../services/voice.js'

const FALL_THRESHOLD = 26 // golpe fuerte = posible caída
const FALL_COOLDOWN_MS = 4000
// En la demo son 60 segundos para poder mostrarlo en vivo; en un producto real serían horas
const INACTIVITY_LIMIT_MS = 60 * 1000

// Detección de caídas e inactividad con el acelerómetro (perfil adulto mayor).
export function useFallDetection() {
  const showToast = useToast()
  const showBanner = useAlertBanner()
  const { sendEvent } = useFamily()
  const [active, setActive] = useState(false)
  const [secondsSinceMovement, setSecondsSinceMovement] = useState(0)
  // useRef guarda valores que cambian muy seguido sin volver a dibujar la pantalla
  const lastMovementTs = useRef(0)
  const inactivityAlerted = useRef(false)

  function resetMovement() {
    lastMovementTs.current = Date.now()
    inactivityAlerted.current = false
  }

  // Muestra el banner "¿Estás bien?" y avisa a la familia. manual = botón de simulación
  function startFallConfirmation(manual) {
    showBanner('¿Estás bien?', 'Se detectó una posible caída.', {
      confirmable: true,
      ms: 15000,
      onConfirm: () => sendEvent('confirm_ok', 'El adulto mayor confirmó que está bien después de la alerta de caída.', 'ok'),
      onEscalate: () => sendEvent('help_needed', 'El adulto mayor pidió ayuda urgente después de una caída.', 'danger'),
    })
    speak('Se detectó una posible caída. ¿Estás bien?')
    vibrate([300, 120, 300, 120, 300])
    showToast('alert', 'Posible caída detectada', manual ? 'Simulación de demo.' : 'Detectado por el sensor de movimiento real.')
    sendEvent('fall', 'Posible caída detectada en el teléfono del adulto mayor. Revisa su ubicación.', 'danger')
    resetMovement()
  }

  const onFall = useEffectEvent(() => startFallConfirmation(false))

  const onInactivity = useEffectEvent(() => {
    showBanner('Sin movimiento', 'El teléfono lleva un buen rato sin moverse.')
    speak('No se ha detectado movimiento en un buen rato. ¿Todo bien?')
    vibrate([200, 100, 200])
    showToast('alert', 'Inactividad prolongada detectada', 'Se avisó a la familia si está sincronizada.')
    sendEvent('fall', 'El teléfono del adulto mayor lleva un buen rato sin moverse. Revisa cómo está.', 'warn')
  })

  useEffect(() => {
    if (!active) return
    resetMovement()
    let lastTrigger = 0

    function handleMotion(event) {
      const magnitude = getMotionMagnitude(event)
      if (magnitude === null) return
      const now = Date.now()
      // 9.8 es la gravedad: si la fuerza se aleja de ese valor, el teléfono se movió
      if (Math.abs(magnitude - 9.8) > 1.2) {
        lastMovementTs.current = now
        inactivityAlerted.current = false
      }
      if (magnitude > FALL_THRESHOLD && now - lastTrigger > FALL_COOLDOWN_MS) {
        lastTrigger = now
        onFall()
      }
    }

    // Cada 2.6 s: actualizar "hace X segundos" y revisar la inactividad
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - lastMovementTs.current
      setSecondsSinceMovement(Math.max(0, Math.round(elapsed / 1000)))
      if (!inactivityAlerted.current && elapsed > INACTIVITY_LIMIT_MS) {
        inactivityAlerted.current = true
        onInactivity()
      }
    }, 2600)

    window.addEventListener('devicemotion', handleMotion)
    return () => {
      window.removeEventListener('devicemotion', handleMotion)
      clearInterval(intervalId)
    }
  }, [active])

  async function toggle() {
    if (active) {
      setActive(false)
      showToast('check', 'Detección de caídas desactivada', '')
      return
    }
    const ok = await requestMotionPermission()
    if (!ok) {
      showToast('alert', 'Sensor no disponible', 'No se pudo obtener permiso del sensor de movimiento en este navegador.')
      return
    }
    setSecondsSinceMovement(0)
    setActive(true)
    showToast('activity', 'Detección de caídas activada', 'Un golpe fuerte o caída del teléfono disparará la alerta automáticamente.')
  }

  return { active, secondsSinceMovement, toggle, simulateFall: () => startFallConfirmation(true) }
}
