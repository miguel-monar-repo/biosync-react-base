import { useEffect, useId, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { askAssistant } from '../services/chat.js'
import { loadChatHintDismissed, saveChatHintDismissed } from '../services/storage.js'
import './ChatWidget.css'

// Asistente virtual: botón flotante en todas las páginas (menos el panel de administración)
// que abre una ventana de chat. Responde dudas sobre BioSync con la API de Claude (vía nuestra API).
// La conversación vive solo en esta pestaña: no se guarda en ninguna base de datos.
const BIENVENIDA = {
  role: 'assistant',
  content: '¡Hola! Soy el asistente de BioSync. Puedo ayudarte con los planes, sus precios y cómo comprar.',
}
const SUGERENCIAS = ['¿Cuánto cuestan los planes?', '¿Qué incluye el plan Familiar?', '¿Cómo compro un plan?']
const MAX_CARACTERES = 500
const MAX_HISTORIAL = 10 // mensajes que se envían a la API (la API también lo limita)
const ESPERA_INVITACION_MS = 2000 // la burbuja de invitación aparece 2 s después de entrar

function ChatWidget() {
  const id = useId()
  const { pathname } = useLocation()
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState([]) // sin la bienvenida, que no se envía a la API
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  // Burbuja "¿Tienes dudas?" junto al botón, para animar a usar el chat
  const [invitacion, setInvitacion] = useState(false)

  const listaRef = useRef(null)
  const inputRef = useRef(null)
  const botonRef = useRef(null)

  // Baja al último mensaje cada vez que llega uno nuevo
  useEffect(() => {
    listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight, behavior: 'smooth' })
  }, [mensajes, enviando, abierto])

  // Al abrir, el foco va al campo de texto
  useEffect(() => {
    if (abierto) inputRef.current?.focus()
  }, [abierto])

  // La invitación aparece una vez por visita, salvo que ya se haya cerrado o usado el chat
  useEffect(() => {
    if (loadChatHintDismissed()) return
    const timer = setTimeout(() => setInvitacion(true), ESPERA_INVITACION_MS)
    return () => clearTimeout(timer)
  }, [])

  // El panel de administración es interno: ahí no se muestra
  if (pathname.startsWith('/admin')) return null

  function descartarInvitacion() {
    setInvitacion(false)
    saveChatHintDismissed()
  }

  function abrir() {
    descartarInvitacion()
    setAbierto(true)
  }

  function cerrar() {
    setAbierto(false)
    botonRef.current?.focus()
  }

  async function preguntar(pregunta) {
    const limpia = pregunta.trim().slice(0, MAX_CARACTERES)
    if (!limpia || enviando) return

    const conversacion = [...mensajes, { role: 'user', content: limpia }]
    setMensajes(conversacion)
    setTexto('')
    setError('')
    setEnviando(true)
    try {
      const respuesta = await askAssistant(conversacion.slice(-MAX_HISTORIAL))
      setMensajes((lista) => [...lista, { role: 'assistant', content: respuesta }])
    } catch (err) {
      // La pregunta que no se pudo responder se quita para poder reenviarla
      setMensajes((lista) => lista.slice(0, -1))
      setTexto(limpia)
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  function manejarEnvio(e) {
    e.preventDefault()
    preguntar(texto)
  }

  // Escape cierra la ventana
  function manejarTecla(e) {
    if (e.key === 'Escape') cerrar()
  }

  const visibles = [BIENVENIDA, ...mensajes]

  return (
    <div className="chat" onKeyDown={manejarTecla}>
      {abierto && (
        <section className="chat-ventana" role="dialog" aria-modal="false" aria-labelledby={`${id}-titulo`}>
          <header className="chat-cabecera">
            <div>
              <h2 id={`${id}-titulo`}>Asistente BioSync</h2>
              <p>Respuestas generadas con IA; pueden contener errores.</p>
            </div>
            <button type="button" className="chat-cerrar" onClick={cerrar} aria-label="Cerrar el asistente">
              ×
            </button>
          </header>

          <ol className="chat-mensajes" ref={listaRef} aria-live="polite">
            {visibles.map((m, i) => (
              <li key={i} className={`chat-burbuja ${m.role === 'user' ? 'usuario' : 'asistente'}`}>
                <span className="chat-oculto">{m.role === 'user' ? 'Tú:' : 'Asistente:'}</span>
                {m.content}
              </li>
            ))}
            {enviando && (
              <li className="chat-burbuja asistente chat-escribiendo">
                <span className="chat-oculto">El asistente está escribiendo</span>
                <span aria-hidden="true">Escribiendo…</span>
              </li>
            )}
          </ol>

          {mensajes.length === 0 && (
            <div className="chat-sugerencias" role="group" aria-label="Preguntas sugeridas">
              {SUGERENCIAS.map((s) => (
                <button key={s} type="button" onClick={() => preguntar(s)} disabled={enviando}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {error && (
            <p className="chat-error" role="alert">
              {error}
            </p>
          )}

          <form className="chat-form" onSubmit={manejarEnvio}>
            <label htmlFor={`${id}-texto`} className="chat-oculto">
              Escribe tu pregunta
            </label>
            <input
              id={`${id}-texto`}
              ref={inputRef}
              type="text"
              autoComplete="off"
              placeholder="Escribe tu pregunta…"
              maxLength={MAX_CARACTERES}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
            <button type="submit" disabled={enviando || !texto.trim()}>
              Enviar
            </button>
          </form>
        </section>
      )}

      {/* Invitación: toda la burbuja abre el chat; la × solo la cierra */}
      {invitacion && !abierto && (
        <div className="chat-invitacion" role="status">
          <button type="button" className="chat-invitacion-texto" onClick={abrir}>
            <strong>Asistente BioSync 👋</strong>
            <span>¿Tienes dudas sobre los planes o los precios? ¡Pregúntame!</span>
          </button>
          <button
            type="button"
            className="chat-invitacion-cerrar"
            onClick={descartarInvitacion}
            aria-label="Cerrar la invitación del asistente"
          >
            ×
          </button>
        </div>
      )}

      <button
        type="button"
        ref={botonRef}
        className="chat-boton"
        onClick={() => (abierto ? cerrar() : abrir())}
        aria-expanded={abierto}
        aria-label={abierto ? 'Cerrar el asistente' : 'Abrir el asistente de BioSync'}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          {abierto ? (
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          ) : (
            <path
              d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>
    </div>
  )
}

export default ChatWidget
