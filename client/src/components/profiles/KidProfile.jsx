import { useState } from 'react'
import { useAlertBanner } from '../../context/AlertBannerContext.js'
import { useFamily } from '../../context/FamilyContext.js'
import { useToast } from '../../context/ToastContext.js'
import { speak, vibrate } from '../../services/voice.js'
import BatteryCard from '../BatteryCard.jsx'
import Icon from '../Icon.jsx'
import RealChip from '../RealChip.jsx'
import RealMap from '../RealMap.jsx'

const SAFE_ZONE = { name: 'Zona segura: Colegio', inZone: true } // dato de ejemplo
const QUICK_REPLIES = ['¿Dónde estás?', 'Te quiero, nos vemos pronto', 'Hora de volver a casa']

// location de useRealLocation('kid'), messages de useKidMessages(),
// playAudio de useAudioStatus().play, battery de useBattery()
function KidProfile({ location, messages, playAudio, battery }) {
  const showToast = useToast()
  const showBanner = useAlertBanner()
  const { isSynced, familyCode, sendEvent } = useFamily()
  const [text, setText] = useState('')

  function simulateCall() {
    playAudio('llamando…', 'Llamada entrante de mamá', 3200)
    showToast('phone', 'Llamando a Mateo', 'El aviso se dice en voz alta aunque no esté mirando la pantalla.')
  }

  function sendChildAlert() {
    playAudio('enviando alerta…', null, 1200)
    showToast(
      'alert',
      'Alerta enviada',
      familyCode
        ? 'Se avisó por voz y vibración en el teléfono de Mateo.'
        : 'Conecta el código de familia para que llegue al teléfono real de Mateo.',
    )
    messages.addMessage('Mamá', '¿Estás bien? Responde por favor', 'warn')
    sendEvent('child_alert', '¿Estás bien? Tus papás preguntan por ti.', 'warn')

    // Sin familia sincronizada, la alerta se muestra en este mismo teléfono
    if (!isSynced) {
      showBanner('¿Estás bien?', 'Tus papás preguntan por ti.', {
        confirmable: true,
        ms: 15000,
        onConfirm: () => messages.addMessage('Mateo', 'Sí, estoy bien 👍', 'ok'),
        onEscalate: () => messages.addMessage('Mateo', 'Necesito ayuda 🆘', 'warn'),
      })
      speak('¿Estás bien? Tus papás preguntan por ti.')
      vibrate()
    }
  }

  function sendMessage(message) {
    playAudio('mensaje nuevo…', message, 2600)
    messages.addMessage('Mamá', message, 'info')
    showToast('message', 'Mensaje enviado', 'Se dice en voz alta en el teléfono de Mateo.')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const message = text.trim()
    if (!message) return
    sendMessage(message)
    setText('')
  }

  return (
    <>
      <div className="dash-head">
        <div className="dash-eyebrow">Perfil niño</div>
        <h1 className="dash-title">Ubicación y comunicación</h1>
        <p className="dash-desc">
          Ubicación real desde el teléfono del niño, mensajes y alertas que se dicen en voz alta y vibran — y si
          conectas el mismo código de familia en el teléfono del tutor, todo llega ahí también en vivo.
        </p>
      </div>

      <div className="grid">
        <div className="card wide">
          <div className="card-label">
            <Icon name="shield" /> Ubicación en vivo{' '}
            {location.active ? (
              <RealChip />
            ) : (
              `— ${SAFE_ZONE.inZone ? 'dentro de zona segura (ejemplo)' : 'fuera de zona segura (ejemplo)'}`
            )}
          </div>
          {location.active && location.lat != null ? (
            <RealMap lat={location.lat} lng={location.lng} />
          ) : (
            <div className="map">
              <div className="zone" style={{ left: '22%', top: '14%' }}></div>
              <div className="pin" style={{ left: '46%', top: '44%' }}></div>
              <div className="label" style={{ left: '24%', top: '18%' }}>
                {SAFE_ZONE.name}
              </div>
            </div>
          )}
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={location.toggle}>
              <Icon name="pin" />
              {location.active ? 'Volver a ubicación de ejemplo' : 'Usar mi ubicación real'}
            </button>
          </div>
        </div>

        <BatteryCard level={battery} />

        <div className="card">
          <div className="card-label">
            <Icon name="phone" /> Llamada rápida
          </div>
          <div className="card-foot card-hint">Simula el aviso de llamada por voz y vibración.</div>
          <button type="button" className="btn" onClick={simulateCall}>
            <Icon name="phone" /> Llamar ahora
          </button>
        </div>

        <div className="card wide status-warn">
          <div className="card-label">
            <Icon name="alert" /> Botón de emergencia
          </div>
          <div className="card-foot card-hint">
            Envía una alerta que se dice en voz alta y vibra en el teléfono del niño (si está sincronizado con el mismo
            código de familia).
          </div>
          <button type="button" className="btn danger" onClick={sendChildAlert}>
            <Icon name="alert" /> Enviar alerta "¿Estás bien?"
          </button>
        </div>

        <div className="card wide">
          <div className="card-label">
            <Icon name="message" /> Mensajes
          </div>
          <form className="msg-compose" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Escribe un mensaje para Mateo…"
              aria-label="Mensaje para Mateo"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="btn ghost">
              Enviar
            </button>
          </form>
          <div className="quick-replies">
            {QUICK_REPLIES.map((reply) => (
              <button key={reply} type="button" className="chip-btn" onClick={() => sendMessage(reply)}>
                {reply}
              </button>
            ))}
          </div>
          <div className="list">
            {/* Los más nuevos primero */}
            {[...messages.list].reverse().map((m, i) => (
              <div key={m.ts ?? `demo-${i}`} className="list-item">
                <div className="li-left">
                  <span className={`chip ${m.type}`}>{m.who}</span> {m.text}
                </div>
                <div className="li-time">{m.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default KidProfile
