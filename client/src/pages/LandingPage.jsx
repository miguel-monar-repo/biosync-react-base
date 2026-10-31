import { Link } from 'react-router'
import ContactSection from '../components/landing/ContactSection.jsx'
import PhoneMockup from '../components/landing/PhoneMockup.jsx'
import './LandingPage.css'

// Propiedades comunes de los iconos de la landing (el color sale de CSS con currentColor)
const svgProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
}

const PROFILE_CARDS = [
  {
    title: 'Deportivo',
    text: 'Para quien se mueve: sigue los pasos y la actividad, y avisa si algo se detiene en medio del entrenamiento.',
    icon: (
      <>
        <path d="M3 17l5-5 4 4 8-9"></path>
        <path d="M15 7h5v5"></path>
      </>
    ),
  },
  {
    title: 'Adulto mayor',
    text: 'Detecta caídas y largos periodos de inactividad para que la familia se entere a tiempo, aunque estén lejos.',
    icon: <path d="M12 21s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.6-7 10-7 10z"></path>,
  },
  {
    title: 'Niño',
    text: 'Muestra dónde está y cómo está, para que mamá y papá estén tranquilos mientras ellos juegan y exploran.',
    icon: (
      <>
        <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"></path>
        <circle cx="12" cy="10" r="2.5"></circle>
      </>
    ),
  },
]

const SENSORS = [
  { label: 'Pasos', icon: <path d="M4 16l4-4 3 3 5-6 4 4"></path> },
  {
    label: 'Ubicación',
    icon: (
      <>
        <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"></path>
        <circle cx="12" cy="10" r="2.5"></circle>
      </>
    ),
  },
  { label: 'Caídas', icon: <path d="M12 5v13m0 0l-4-4m4 4l4-4"></path> },
  {
    label: 'Inactividad',
    icon: (
      <>
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M12 7v5l3 2"></path>
      </>
    ),
  },
  {
    label: 'Batería',
    icon: (
      <>
        <rect x="3" y="8" width="16" height="9" rx="2"></rect>
        <path d="M21 11v3"></path>
      </>
    ),
  },
]

const STEPS = [
  {
    num: '01',
    title: 'La idea',
    text: 'Nació de una pregunta: ¿y si el teléfono pudiera avisarle a la familia cuando algo no va bien? La idea fue de Miguel y Paula, quienes la convirtieron en BioSync.',
  },
  {
    num: '02',
    title: 'La primera demo',
    text: 'Construimos una versión web que ya usa los sensores reales del teléfono (pasos, ubicación, caídas, inactividad y batería) y la probamos con tres perfiles: deportivo, adulto mayor y niño.',
  },
  {
    num: '03',
    title: 'El siguiente paso',
    text: 'Conectar a cada persona con su familia: que las alertas y el “estoy bien” lleguen directo a los teléfonos de quienes los cuidan.',
  },
]

function LandingPage() {
  return (
    <div className="bs-main-container">
      <title>BioSync, Página de la Marca</title>

      <nav className="bs-nav">
        <div className="bs-logo-container">
          <div className="bs-logo-icon">
            <svg width="22" height="22" {...svgProps} strokeWidth="2.4">
              <path d="M3 12h4l3-7 4 14 3-7h4"></path>
            </svg>
          </div>
          <div className="bs-logo-text">BioSync</div>
        </div>
        <div className="bs-nav-links">
          <a href="#descripcion">Quiénes somos</a>
          <a href="#dedica">A qué nos dedicamos</a>
          <a href="#origen">Cómo nació</a>
          <a href="#contacto">Contacto</a>
        </div>
      </nav>

      <header className="bs-hero">
        <div className="bs-hero-content">
          <div className="bs-badge">
            <span className="bs-badge-dot"></span>
            Página de la Marca
          </div>
          <h1 className="bs-hero-title">
            Familia conectada <span className="bs-highlight">desde el teléfono</span>
          </h1>
          <p className="bs-hero-desc">
            BioSync convierte el celular de cada persona en un aviso de cuidado: sabe cómo está y le cuenta a su familia
            cuando algo no va bien.
          </p>
          <div className="bs-hero-actions">
            {/* Link cambia de página sin recargar (React Router) */}
            <Link className="bs-cta" to="/app">
              Probar la demo
            </Link>
            <a className="bs-btn-outline" href="#dedica">
              Ver qué hace
            </a>
          </div>
        </div>

        <PhoneMockup />
      </header>

      <section id="descripcion" className="bs-section-desc">
        <div className="bs-container bs-desc-grid">
          <div className="bs-section-header">
            <div className="bs-section-tag">01 · Quiénes somos</div>
            <h2 className="bs-section-title">El emprendimiento</h2>
          </div>
          <div className="bs-desc-text">
            <p>
              BioSync es una aplicación que mantiene a las familias conectadas sin que nadie tenga que llamar cada rato
              para preguntar “¿estás bien?”.
            </p>
            <p>
              Funciona con lo que ya llevamos en el bolsillo: los sensores del teléfono registran pasos, ubicación,
              caídas, inactividad y batería, y la app transforma esa información en algo que la familia entiende de un
              vistazo.
            </p>
            <p className="bs-desc-quote">Sin aparatos extra. Sin complicaciones. Solo el teléfono.</p>
          </div>
        </div>
      </section>

      <section id="dedica" className="bs-container bs-dedica-section">
        <div className="bs-dedica-intro">
          <div className="bs-section-tag">02 · A qué nos dedicamos</div>
          <h2 className="bs-section-title">Cuidamos a quien más quieres, a la distancia</h2>
          <p className="bs-dedica-desc">
            Un mismo teléfono, tres formas de cuidar. BioSync se adapta a cada etapa de la vida con perfiles pensados
            para cada persona.
          </p>
        </div>

        <div className="bs-cards-grid">
          {PROFILE_CARDS.map((card) => (
            <div key={card.title} className="bs-card">
              <div className="bs-card-icon">
                <svg width="28" height="28" {...svgProps}>
                  {card.icon}
                </svg>
              </div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>

        <div className="bs-features-block">
          <div className="bs-features-title">Lo que vigila, con sensores reales</div>
          <div className="bs-pill-list">
            {SENSORS.map((sensor) => (
              <div key={sensor.label} className="bs-pill">
                <svg width="20" height="20" {...svgProps}>
                  {sensor.icon}
                </svg>
                {sensor.label}
              </div>
            ))}
          </div>
        </div>

        <div className="bs-alert-boxes">
          <div className="bs-alert-box bs-alert-ok">
            <div className="bs-alert-heading">“Estoy bien”</div>
            <p>Un toque para decirle a la familia que todo está en orden.</p>
          </div>
          <div className="bs-alert-box bs-alert-help">
            <div className="bs-alert-heading">“Necesito ayuda”</div>
            <p>Un toque para pedir ayuda, con alertas por voz y vibración que no se pasan por alto.</p>
          </div>
        </div>
      </section>

      <section id="origen" className="bs-origin-section">
        <div className="bs-container bs-origin-grid">
          <div className="bs-section-intro">
            <div className="bs-section-tag">03 · Cómo nació</div>
            <h2 className="bs-section-title">De una preocupación a una app</h2>
          </div>
          <div className="bs-steps-grid">
            {STEPS.map((step) => (
              <div key={step.num} className="bs-step-card">
                <div className="bs-step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

      <footer className="bs-footer">
        <div className="bs-container bs-footer-cta">
          <h2>Cuidar a tu familia cabe en un teléfono</h2>
          <Link className="bs-cta" to="/app">
            Probar BioSync
          </Link>
        </div>
        <div className="bs-container bs-footer-bar">
          <div>BioSync · Familia conectada desde el teléfono</div>
          <div>Página de la Marca</div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
