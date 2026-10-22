import Icon from './Icon.jsx'

function Topbar() {
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
      </div>
    </header>
  )
}

export default Topbar
