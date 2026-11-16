import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext.js'
import Icon from './Icon.jsx'

// `showSession`: muestra el correo y "Cerrar sesión" (en /app).
// `demo`: en la demo pública muestra "Volver al inicio" y "Quiero comprar" (lleva a los planes).
function Topbar({ showSession = false, demo = false }) {
  const { user, logout } = useAuth()

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="5.5" cy="14.5" r="2.3" fill="currentColor" />
            <circle cx="14.5" cy="5.5" r="2.3" stroke="currentColor" strokeWidth="1.4" />
            <line x1="7.2" y1="12.8" x2="12.8" y2="7.2" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>
        <div>
          <div className="brand-name">BioSync</div>
          <div className="brand-sub">Familia conectada desde el teléfono</div>
        </div>
      </div>
      <div className="device-status">
        <div className="pill">
          <Icon name="shield" />
          <span>
            Alertas por <b>voz</b> y vibración listas
          </span>
        </div>
        {demo && (
          <>
            <Link className="pill-btn topbar-link home-btn" to="/">
              Volver al inicio
            </Link>
            <Link className="pill-btn topbar-link buy-btn" to="/planes">
              Quiero comprar
            </Link>
          </>
        )}
        {/* Al cerrar sesión, la ruta protegida manda de vuelta al login */}
        {showSession && user && (
          <div className="session">
            <span className="session-email">{user.email}</span>
            <button type="button" className="pill-btn" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Topbar
