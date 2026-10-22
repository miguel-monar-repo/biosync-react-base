import { useRef, useState } from 'react'
import { speak, vibrate } from '../services/voice.js'

const READY_LABEL = 'Voz y vibración listas'

// Estado de la barra de audio: muestra la onda y un texto mientras "suena" un aviso.
export function useAudioStatus() {
  const [active, setActive] = useState(false)
  const [label, setLabel] = useState(READY_LABEL)
  const timer = useRef(null)

  // label: texto de la barra, spoken: lo que se dice en voz alta (o null), ms: duración
  function play(newLabel, spoken, ms = 3400) {
    setActive(true)
    setLabel(newLabel)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setActive(false)
      setLabel(READY_LABEL)
    }, ms)
    if (spoken) {
      speak(spoken)
      vibrate()
    }
  }

  return { active, label, play }
}
