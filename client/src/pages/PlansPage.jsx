import { Link } from 'react-router'
import PlanCard from '../components/PlanCard.jsx'
import { usePlans } from '../context/PlansContext.js'
import './PlansPage.css'

// Página de planes y precios (ruta /planes). Los planes vienen de MongoDB (colección "planes");
// cada uno se dibuja con <PlanCard>. "Comprar" lleva al formulario con el plan ya elegido.
function PlansPage() {
  const { plans, status, retry } = usePlans()

  return (
    <div className="planes">
      <title>BioSync, Planes</title>

      <nav className="planes-nav">
        <Link className="planes-logo" to="/">
          BioSync
        </Link>
        <div className="planes-nav-links">
          <Link to="/demo">Probar la demo</Link>
          <Link to="/login">Ingresar</Link>
        </div>
      </nav>

      <main className="planes-main">
        <header className="planes-intro">
          <h1>Elige tu plan</h1>
          <p>Un mismo teléfono, el cuidado que tu familia necesita. Paga mes a mes y cancela cuando quieras.</p>
        </header>

        {status === 'loading' && <p className="planes-estado">Cargando planes…</p>}

        {status === 'error' && (
          <div className="planes-estado" role="alert">
            <p>No pudimos cargar los planes. Revisa tu conexión.</p>
            <button type="button" className="planes-comprar planes-reintentar" onClick={retry}>
              Reintentar
            </button>
          </div>
        )}

        {status === 'ready' && (
          <ul className="planes-grid">
            {plans.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} posicion={i} />
            ))}
          </ul>
        )}

        <p className="planes-nota">Precios en dólares estadounidenses (USD), la moneda oficial de Ecuador.</p>
      </main>
    </div>
  )
}

export default PlansPage
