import Icon from './Icon.jsx'
import RealChip from './RealChip.jsx'

// level viene de useBattery() (null si no está disponible). note: texto cuando sí hay dato
function BatteryCard({ level, note = '' }) {
  const available = level != null
  return (
    <div className="card">
      <div className="card-label">
        <Icon name="battery" /> Batería del teléfono {available && <RealChip />}
      </div>
      <div className="card-value">
        {available ? level : '—'}
        <small>{available ? '%' : ''}</small>
      </div>
      <div className="card-foot">{available ? note : 'No disponible en este navegador.'}</div>
    </div>
  )
}

export default BatteryCard
