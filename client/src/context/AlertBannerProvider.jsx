import { useCallback, useRef, useState } from 'react'
import AlertBanner from '../components/AlertBanner.jsx'
import { speak } from '../services/voice.js'
import { AlertBannerContext } from './AlertBannerContext.js'
import { useToast } from './ToastContext.js'

export function AlertBannerProvider({ children }) {
  const showToast = useToast()
  const [banner, setBanner] = useState({
    show: false,
    title: 'Alerta',
    body: '—',
    tone: null,
    confirmable: false,
  })
  // Guardamos las funciones onConfirm/onEscalate de la alerta activa
  const activeAlert = useRef(null)
  const hideTimer = useRef(null)

  const hideBanner = useCallback(() => {
    setBanner((b) => ({ ...b, show: false }))
  }, [])

  const showBanner = useCallback(
    (title, body, opts = {}) => {
      activeAlert.current = opts.confirmable ? opts : null
      setBanner({ show: true, title, body, tone: opts.tone || null, confirmable: !!opts.confirmable })
      clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(hideBanner, opts.ms || 4200)
    },
    [hideBanner],
  )

  function handleConfirm() {
    const alert = activeAlert.current
    hideBanner()
    activeAlert.current = null
    showToast('check', 'Confirmado', 'Se avisó que estás bien.')
    speak('Gracias por confirmar que estás bien.')
    if (alert?.onConfirm) alert.onConfirm()
  }

  function handleEscalate() {
    const alert = activeAlert.current
    hideBanner()
    activeAlert.current = null
    showToast('alert', 'Ayuda solicitada', 'Se avisó que necesitas ayuda urgente.')
    speak('Se avisó que necesitas ayuda urgente.')
    if (alert?.onEscalate) alert.onEscalate()
  }

  return (
    <AlertBannerContext value={showBanner}>
      <AlertBanner banner={banner} onConfirm={handleConfirm} onEscalate={handleEscalate} />
      {children}
    </AlertBannerContext>
  )
}
