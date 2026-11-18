import { Link } from 'react-router'
import { formatearPrecio } from '../../../shared/planes.mjs'

// Tarjeta de un plan en la página /planes. Todo lo que muestra llega por props
// desde MongoDB (colección "planes"), así que no hay textos ni precios escritos aquí.
//   plan:     { id, nombre, precio, descripcion, incluye, destacado }
//   posicion: lugar de la tarjeta en la lista, para que caigan una tras otra (ver PlansPage.css)
// Los estilos están en pages/PlansPage.css.
function PlanCard({ plan, posicion }) {
  return (
    <li className={`planes-card${plan.destacado ? ' destacado' : ''}`} style={{ '--i': posicion }}>
      {plan.destacado && <span className="planes-etiqueta">Recomendado</span>}
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
  )
}

export default PlanCard
