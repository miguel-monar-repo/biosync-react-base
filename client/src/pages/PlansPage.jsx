import { Link } from 'react-router'
import { formatearPrecio, PLANES_APP } from '../../../shared/planes.mjs'
import './PlansPage.css'

// Página de planes y precios (ruta /planes). "Comprar" lleva al formulario de compra
// con el plan ya elegido (/comprar?plan=...). Los precios están en shared/planes.mjs.
function PlansPage() {
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

        <ul className="planes-grid">
          {/* --i: posición de la tarjeta, para que caigan una tras otra (ver PlansPage.css) */}
          {PLANES_APP.map((plan, i) => (
            <li
              key={plan.id}
              className={`planes-card${plan.id === 'familiar' ? ' destacado' : ''}`}
              style={{ '--i': i }}
            >
              {plan.id === 'familiar' && <span className="planes-etiqueta">Recomendado</span>}
              <h2>{plan.nombre}</h2>
              <p className="planes-precio">
                {formatearPrecio(plan.precio)} <span>/ mes</span>
              </p>
              <p className="planes-descripcion">{plan.descripcion}</p>
              <ul className="planes-incluye">
                {plan.incluye.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link className="planes-comprar" to={`/comprar?plan=${plan.id}`}>
                Comprar
              </Link>
            </li>
          ))}
        </ul>

        <p className="planes-nota">Precios en dólares estadounidenses (USD), la moneda oficial de Ecuador.</p>
      </main>
    </div>
  )
}

export default PlansPage
