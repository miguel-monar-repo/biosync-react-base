import { useState } from 'react'
import { useFamily } from '../context/FamilyContext.js'
import { useToast } from '../context/ToastContext.js'
import { addFamilyMessage } from '../services/firebase.js'
import { currentTime } from '../services/sensors.js'

// Mensajes de ejemplo para la demo
const DEMO_MESSAGES = [
  { who: 'Mateo', text: 'Ya llegué al colegio 👍', time: '07:52', type: 'ok' },
  { who: 'Mamá', text: 'Que tengas buen día ❤️', time: '07:53', type: 'info' },
]

// Mensajes del perfil niño. Sin familia sincronizada se guardan solo en este teléfono;
// con familia, se envían a Firebase y la lista llega de ahí.
export function useKidMessages() {
  const showToast = useToast()
  const { isSynced, familyCode, messages } = useFamily()
  const [localMessages, setLocalMessages] = useState(DEMO_MESSAGES)

  // type: 'ok' | 'info' | 'warn' (color de la etiqueta)
  function addMessage(who, text, type) {
    const entry = { who, text, time: currentTime(), type, ts: Date.now() }
    if (isSynced) {
      addFamilyMessage(familyCode, entry).catch((err) => {
        showToast('alert', 'No se pudo enviar', err.message || 'Revisa tu conexión o la configuración de Firebase.')
      })
    } else {
      setLocalMessages((list) => [...list, entry])
    }
  }

  const list = isSynced && messages ? messages : localMessages
  return { list, addMessage }
}
