import { useState } from 'react'
import { useToast } from '../../context/ToastContext.js'

// Textos de los sensores según el perfil elegido en el teléfono de muestra
const PROFILES = [
  { id: 'deportivo', label: 'Deportivo', pasos: 'en vivo (alta act.)', caidas: 'vigilando' },
  { id: 'adulto', label: 'Adulto mayor', pasos: 'monitoreando', caidas: 'activo (caídas)' },
  { id: 'nino', label: 'Niño', pasos: 'zona escolar', caidas: 'seguro' },
]

function PhoneMockup() {
  const showToast = useToast()
  const [profile, setProfile] = useState('deportivo')
  // Al principio se ven los textos por defecto; al tocar un perfil, los de ese perfil
  const [sensors, setSensors] = useState({ pasos: 'en vivo', caidas: 'vigilando' })
  const [status, setStatus] = useState('ok') // 'ok' = punto verde, 'help' = punto rojo

  function selectProfile(p) {
    setProfile(p.id)
    setSensors({ pasos: p.pasos, caidas: p.caidas })
  }

  function handleOk() {
    setStatus('ok')
    showToast('check', '¡Estado enviado!', 'Tu familia ha recibido el aviso de que estás bien.')
  }

  function handleHelp() {
    setStatus('help')
    showToast('alert', '¡Alerta activada!', 'Se ha enviado una señal de ayuda y ubicación a tus contactos.')
  }

  return (
    <div className="bs-phone-wrapper">
      <div className="bs-phone-container">
        <div className="bs-ring bs-ring-1"></div>
        <div className="bs-ring bs-ring-2"></div>
        <div className="bs-ring bs-ring-3"></div>
        <div className="bs-phone">
          <div className="bs-phone-header">
            <div className="bs-phone-title">BioSync</div>
            <div className={`bs-phone-status-dot${status === 'help' ? ' help' : ''}`}></div>
          </div>
          <div className="bs-phone-subtitle">
            Alertas por <span className="bs-highlight">voz</span> y vibración listas
          </div>
          <div className="bs-phone-tags">
            {PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`bs-tag${profile === p.id ? ' active' : ''}`}
                aria-pressed={profile === p.id}
                onClick={() => selectProfile(p)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="bs-phone-sensors">
            <div className="bs-sensor-item">
              <span>Pasos</span>
              <span className="bs-highlight">{sensors.pasos}</span>
            </div>
            <div className="bs-sensor-item">
              <span>Ubicación</span>
              <span className="bs-highlight">en vivo</span>
            </div>
            <div className="bs-sensor-item">
              <span>Caídas</span>
              <span className="bs-highlight">{sensors.caidas}</span>
            </div>
            <div className="bs-sensor-item">
              <span>Batería</span>
              <span className="bs-highlight">en vivo</span>
            </div>
          </div>
          <button type="button" className="bs-phone-btn-ok" onClick={handleOk}>
            Estoy bien
          </button>
          <button type="button" className="bs-phone-btn-help" onClick={handleHelp}>
            Necesito ayuda
          </button>
        </div>
      </div>
    </div>
  )
}

export default PhoneMockup
