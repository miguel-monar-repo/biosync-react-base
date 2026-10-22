import Icon from './Icon.jsx'
import './AlertBanner.css'

// Banner que sube desde abajo. Los datos y las acciones vienen de AlertBannerProvider.
function AlertBanner({ banner, onConfirm, onEscalate }) {
  const classes = ['alert-banner']
  if (banner.show) classes.push('show')
  if (banner.tone === 'ok') classes.push('tone-ok')

  return (
    <div className={classes.join(' ')} role="alert">
      <div className="ab-ico">
        <Icon name="alert" />
      </div>
      <div className="ab-text">
        <div className="ab-title">{banner.title}</div>
        <div className="ab-body">{banner.body}</div>
      </div>
      {banner.confirmable && (
        <div className="ab-actions">
          <button type="button" className="ab-btn ab-btn-ok" onClick={onConfirm}>
            Estoy bien
          </button>
          <button type="button" className="ab-btn ab-btn-help" onClick={onEscalate}>
            Necesito ayuda
          </button>
        </div>
      )}
    </div>
  )
}

export default AlertBanner
