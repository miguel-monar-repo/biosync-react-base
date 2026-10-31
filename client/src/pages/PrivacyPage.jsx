import { Link } from 'react-router'
import './PrivacyPage.css'

// Aviso corto sobre los datos del formulario de contacto (ruta /politica-datos).
// BioSync es un proyecto académico: cuando sea un servicio real, esta página se
// reemplaza por una política completa según la Ley Orgánica de Protección de Datos Personales del Ecuador.
function PrivacyPage() {
  return (
    <main className="privacidad">
      <title>BioSync, Aviso sobre tus datos</title>

      <article className="privacidad-tarjeta">
        <h1>Aviso sobre tus datos</h1>

        <p>
          BioSync es un <strong>proyecto académico de demostración</strong> y todavía no es un servicio real.
        </p>

        <p>
          Los datos que escribas en el formulario de contacto se usan <strong>solo para probar que funciona</strong>.
        </p>

        <p className="privacidad-destacado">No compartimos tus datos con terceros ni los usamos para otros fines.</p>

        <p>Se guardan en una base de datos de prueba (MongoDB Atlas) y se pueden borrar en cualquier momento.</p>

        <p>Si no quieres dejar tus datos reales, puedes usar datos de ejemplo.</p>

        <p className="privacidad-nota">
          Si el proyecto llega a funcionar como servicio real, esta página se reemplazará por una política completa
          según la Ley Orgánica de Protección de Datos Personales del Ecuador.
        </p>

        <Link className="privacidad-volver" to="/">
          Volver al inicio
        </Link>
      </article>
    </main>
  )
}

export default PrivacyPage
