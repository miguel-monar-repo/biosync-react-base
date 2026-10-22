import Icon from '../Icon.jsx'
import RealChip from '../RealChip.jsx'

const STEPS_GOAL = 10000
// Datos de ejemplo cuando el GPS real está apagado
const DEMO = { km: 4.7, pace: "5'42\"", kcal: 388, streak: 6 }

// stepCounter viene de useStepCounter() y route de useRouteTracker()
function SportProfile({ stepCounter, route }) {
  const pct = Math.min(100, Math.round((stepCounter.steps / STEPS_GOAL) * 100))
  const realKcal = Math.round(route.km * 62)

  return (
    <>
      <div className="dash-head">
        <div className="dash-eyebrow">Perfil deportivo</div>
        <h1 className="dash-title">Actividad de hoy</h1>
        <p className="dash-desc">
          Pasos, distancia y ritmo reales, calculados con los sensores de tu propio teléfono mientras caminas o corres.
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-label">
            <Icon name="footprints" /> Pasos {stepCounter.active && <RealChip />}
          </div>
          <div className="card-value">
            {stepCounter.steps.toLocaleString()}
            <small>/ {STEPS_GOAL.toLocaleString()}</small>
          </div>
          <div className="progress">
            <div style={{ width: `${pct}%` }}></div>
          </div>
          <div className="card-foot">{pct}% de la meta diaria</div>
        </div>

        <div className="card">
          <div className="card-label">
            <Icon name="pin" /> Distancia {route.active && <RealChip />}
          </div>
          <div className="card-value">
            {route.active ? route.km.toFixed(2) : DEMO.km}
            <small>km</small>
          </div>
          <div className="card-foot">
            {route.active ? `Ritmo real: ${route.pace}` : `Ritmo promedio ${DEMO.pace} /km (ejemplo)`}
          </div>
        </div>

        <div className="card">
          <div className="card-label">
            <Icon name="flame" /> Calorías
          </div>
          <div className="card-value">
            {route.active ? realKcal : DEMO.kcal}
            <small>kcal</small>
          </div>
          <div className="card-foot">
            {route.active
              ? 'Estimado a partir de tu distancia real (no es una medición directa)'
              : `Racha activa: ${DEMO.streak} días seguidos (ejemplo)`}
          </div>
        </div>

        <div className="card wide">
          <div className="card-label">
            <Icon name="activity" /> Podómetro real
          </div>
          <div className="card-foot card-hint">
            Usa el sensor de movimiento de tu propio teléfono para contar tus pasos de verdad mientras caminas con el
            celular encima.
          </div>
          <button type="button" className={`btn${stepCounter.active ? ' danger' : ''}`} onClick={stepCounter.toggle}>
            <Icon name="activity" />
            {stepCounter.active ? 'Desactivar podómetro real' : 'Activar podómetro real'}
          </button>
        </div>

        <div className="card wide">
          <div className="card-label">
            <Icon name="route" /> Ruta y distancia real (GPS)
          </div>
          <div className="card-foot card-hint">
            Calcula tu distancia real sumando tu movimiento por GPS mientras corres o caminas.
          </div>
          <button type="button" className={`btn${route.active ? ' danger' : ''}`} onClick={route.toggle}>
            <Icon name="pin" />
            {route.active ? 'Detener seguimiento real' : 'Activar seguimiento real'}
          </button>
        </div>
      </div>
    </>
  )
}

export default SportProfile
