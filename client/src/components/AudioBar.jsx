import { speak } from '../services/voice.js'
import Icon from './Icon.jsx'

// audio viene de useAudioStatus()
function AudioBar({ audio }) {
  return (
    <div className="audio-bar">
      <Icon name="earbuds" />
      <div className={`wave${audio.active ? ' active' : ''}`} aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="earbuds-text">{audio.label}</span>
      <button
        type="button"
        className="pill-btn"
        onClick={() => speak('Hola, esto es una prueba de audio de BioSync')}
      >
        Probar voz
      </button>
    </div>
  )
}

export default AudioBar
