import BatteryCard from '../BatteryCard.jsx'
import Icon from '../Icon.jsx'
import RealChip from '../RealChip.jsx'
import RealMap from '../RealMap.jsx'

// meds y onToggleMed vienen de DashboardPage; location de useRealLocation('senior');
// fall de useFallDetection(); battery de useBattery()
function SeniorProfile({ meds, onToggleMed, location, fall, battery }) {
  // El prototipo nunca suma movimientos, así que este contador se queda en 0
  const movementEvents = 0

  return (
    <>
      <div className="dash-head">
        <div className="dash-eyebrow">Perfil adulto mayor</div>
        <h1 className="dash-title">Salud y bienestar</h1>
        <p className="dash-desc">
          Lo real desde este teléfono: ubicación GPS, detección de caídas e inactividad, actividad detectada y su propia
          batería. Presión y medicamentos son datos de ejemplo — el teléfono no tiene esos sensores.
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-label">
            <Icon name="activity" /> Actividad detectada hoy {fall.active && <RealChip />}
          </div>
          <div className="card-value">
            {movementEvents}
            <small>movimientos</small>
          </div>
          <div className="card-foot">
            {fall.active
              ? 'Cada vez que el teléfono detecta movimiento significativo, suma uno.'
              : 'Activa la detección real abajo para empezar a contar.'}
          </div>
        </div>

        <BatteryCard level={battery} note="Importante para saber si su teléfono sigue con vida." />

        <div className="card wide">
          <div className="card-label">
            <Icon name="pin" /> Ubicación {location.active && <RealChip />}
          </div>
          {location.active && location.lat != null ? (
            <RealMap lat={location.lat} lng={location.lng} />
          ) : (
            <>
              <div className="map map-small">
                <div className="zone" style={{ left: '20%', top: '10%', width: 90, height: 90 }}></div>
                <div className="pin self" style={{ left: '52%', top: '48%' }}></div>
              </div>
              <div className="card-foot">Ejemplo — activa el GPS real abajo.</div>
            </>
          )}
          <div className="btn-row">
            <button type="button" className="btn ghost" onClick={location.toggle}>
              <Icon name="pin" />
              {location.active ? 'Volver a ubicación de ejemplo' : 'Usar mi ubicación real'}
            </button>
          </div>
        </div>

        <div className="card wide">
          <div className="card-label">
            <Icon name="pill" /> Medicamentos de hoy
          </div>
          <div className="card-foot meds-note">
            Dato de ejemplo — se llenaría a mano o desde una receta digital.
          </div>
          <div className="checklist">
            {meds.map((m, i) => (
              <label key={m.name} className={`check${m.done ? ' done' : ''}`}>
                <input type="checkbox" checked={m.done} onChange={() => onToggleMed(i)} />
                {m.name} — {m.time}
              </label>
            ))}
          </div>
        </div>

        <div className={`card wide${fall.active ? ' status-danger' : ''}`}>
          <div className="card-label">
            <Icon name="alert" /> Detección de caídas e inactividad {fall.active && <RealChip />}
          </div>
          <div className="card-foot fall-note">
            Con el sensor de movimiento del teléfono: un golpe fuerte dispara la alerta de caída, y si el teléfono pasa
            mucho tiempo sin moverse, también avisa (aquí bajamos el tiempo a segundos para poder demostrarlo en vivo —
            en un producto real serían horas).
            {fall.active && (
              <>
                <br />
                <br />
                <b>Última vez que se movió:</b> hace {fall.secondsSinceMovement} segundos.
              </>
            )}
          </div>
          <div className="btn-row">
            <button type="button" className={`btn${fall.active ? ' danger' : ''}`} onClick={fall.toggle}>
              <Icon name="alert" />
              {fall.active ? 'Desactivar detección real' : 'Activar detección real'}
            </button>
            <button type="button" className="btn ghost" onClick={fall.simulateFall}>
              Simular caída (demo)
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SeniorProfile
