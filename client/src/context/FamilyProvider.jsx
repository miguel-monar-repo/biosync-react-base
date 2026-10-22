import { useCallback, useEffect, useEffectEvent, useState } from 'react'
import { addFamilyEvent, db, subscribeMessages, subscribeNewEvents } from '../services/firebase.js'
import { loadFamilyCode, saveFamilyCode } from '../services/storage.js'
import { speak, vibrate } from '../services/voice.js'
import { useAlertBanner } from './AlertBannerContext.js'
import { FamilyContext } from './FamilyContext.js'
import { useToast } from './ToastContext.js'

export function FamilyProvider({ children }) {
  const showToast = useToast()
  const showBanner = useAlertBanner()
  const [familyCode, setFamilyCode] = useState(() => (db ? loadFamilyCode() : null))
  // Mensajes de Firebase. null = todavía no llegaron (se usan los locales)
  const [messages, setMessages] = useState(null)

  const isConfigured = db !== null
  const isSynced = isConfigured && !!familyCode

  const sendEvent = useCallback(
    (type, message, severity) => {
      if (!isSynced) return
      addFamilyEvent(familyCode, type, message, severity).catch(() => {})
    },
    [isSynced, familyCode],
  )

  function joinFamily(rawCode) {
    const code = rawCode.trim().toLowerCase().replace(/\s+/g, '-')
    if (!code) return
    saveFamilyCode(code)
    setFamilyCode(code)
    showToast('check', 'Conectado a la familia', `Código: ${code}`)
  }

  // Qué hacer cuando llega una alerta enviada desde el otro teléfono
  const onFamilyEvent = useEffectEvent((ev) => {
    if (ev.type === 'confirm_ok') {
      showBanner('Todo bien', ev.message, { tone: 'ok', ms: 5000 })
      speak(ev.message)
      return
    }
    if (ev.type === 'help_needed') {
      showBanner('Necesita ayuda urgente', ev.message, { ms: 10000 })
      speak(ev.message)
      vibrate([300, 100, 300, 100, 300, 100, 300])
      return
    }

    const confirmable = ev.type === 'fall' || ev.type === 'child_alert'
    showBanner('¿Estás bien?', ev.message, {
      confirmable,
      ms: confirmable ? 15000 : 4200,
      onConfirm: () => sendEvent('confirm_ok', 'Confirmó que está bien.', 'ok'),
      onEscalate: () => sendEvent('help_needed', 'Pidió ayuda urgente.', 'danger'),
    })
    speak(ev.message)
    vibrate(ev.severity === 'danger' ? [300, 120, 300, 120, 300] : [200])
  })

  // Escuchar mensajes y alertas de la familia mientras haya código.
  // La función que devuelve el efecto cancela la suscripción (al cambiar de código o salir).
  useEffect(() => {
    if (!isSynced) return
    const stopMessages = subscribeMessages(familyCode, setMessages)
    const stopEvents = subscribeNewEvents(familyCode, onFamilyEvent)
    return () => {
      stopMessages()
      stopEvents()
    }
  }, [isSynced, familyCode])

  const value = { isConfigured, isSynced, familyCode, messages, joinFamily, sendEvent }

  return <FamilyContext value={value}>{children}</FamilyContext>
}
