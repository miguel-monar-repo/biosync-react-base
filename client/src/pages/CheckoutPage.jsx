import { useEffect, useId, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { buscarPlan, formatearPrecio, PLANES_APP } from '../../../shared/planes.mjs'
import { reglasCompra } from '../../../shared/validacionCompra.mjs'
import { avisos } from '../../../shared/validacionContacto.mjs'
import { sendPurchase } from '../services/purchases.js'
import './PlansPage.css'
import './CheckoutPage.css'

// Formulario de compra (ruta /comprar?plan=...). Llega con el plan ya elegido desde /planes.
// Guarda la solicitud en la API; el equipo crea el usuario desde el panel y le envía
// la contraseña y el método de pago al correo indicado.
const CAMPOS = ['plan', 'email', 'confirmEmail', 'celular', 'consentimiento']
const ERROR_ENVIO = 'No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.'
const ERROR_CONFIRMACION = 'Los dos correos no coinciden.'

// Reglas de cada campo: las de shared/validacionCompra.mjs más la confirmación del correo
function validarCampo(campo, valores) {
  if (campo === 'confirmEmail') {
    const a = reglasCompra.email(valores.email).valor
    const b = reglasCompra.email(valores.confirmEmail).valor
    return a === b ? null : ERROR_CONFIRMACION
  }
  return reglasCompra[campo](valores[campo]).error
}

function CheckoutPage() {
  const id = useId()
  const [searchParams] = useSearchParams()
  const planInicial = buscarPlan(searchParams.get('plan'))?.id ?? ''

  const [valores, setValores] = useState({
    plan: planInicial,
    email: '',
    confirmEmail: '',
    celular: '',
    consentimiento: false,
    website: '',
  })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(null) // { plan, email } cuando la solicitud se guardó
  const exitoRef = useRef(null)

  useEffect(() => {
    if (enviado) exitoRef.current?.focus()
  }, [enviado])

  function enfocar(campo) {
    document.getElementById(`${id}-${campo}`)?.focus()
  }

  function manejarCambio(e) {
    const { name, type, value, checked, tagName } = e.target
    const valor = type === 'checkbox' ? checked : value
    const nuevos = { ...valores, [name]: valor }
    setValores(nuevos)
    if (name === 'website') return
    // Checkbox y select se validan al cambiar; el resto, solo si ya tenían error
    if (type === 'checkbox' || tagName === 'SELECT' || errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: validarCampo(name, nuevos) }))
    }
  }

  function manejarBlur(e) {
    const { name, type, tagName } = e.target
    if (type === 'checkbox' || tagName === 'SELECT') return
    setErrores((prev) => ({ ...prev, [name]: validarCampo(name, valores) }))
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    if (enviando) return
    setErrorGeneral('')

    const nuevos = {}
    for (const campo of CAMPOS) {
      const error = validarCampo(campo, valores)
      if (error) nuevos[campo] = error
    }
    setErrores(nuevos)
    const primero = CAMPOS.find((c) => nuevos[c])
    if (primero) {
      enfocar(primero)
      return
    }

    setEnviando(true)
    try {
      // La confirmación del correo no se envía: solo sirve para revisar que esté bien escrito
      const { plan, email, celular, consentimiento, website } = valores
      await sendPurchase({ plan, email, celular, consentimiento, website })
      setEnviado({ plan: buscarPlan(valores.plan), email: reglasCompra.email(valores.email).valor })
    } catch (error) {
      if (error.errores) {
        setErrores(error.errores)
        const primeroApi = CAMPOS.find((c) => error.errores[c])
        if (primeroApi) enfocar(primeroApi)
      } else {
        setErrorGeneral(error.status === 429 ? error.message : ERROR_ENVIO)
      }
    } finally {
      setEnviando(false)
    }
  }

  const props = (campo) => ({
    id: `${id}-${campo}`,
    name: campo,
    onChange: manejarCambio,
    onBlur: manejarBlur,
    'aria-invalid': errores[campo] ? 'true' : undefined,
    'aria-describedby': `${id}-error-${campo}`,
  })

  const error = (campo) => (
    <p className="compra-error" id={`${id}-error-${campo}`}>
      {errores[campo]}
    </p>
  )

  const plan = buscarPlan(valores.plan)
  const avisoCelular = !errores.celular && valores.celular ? avisos.celular(valores.celular) : null

  return (
    <div className="planes">
      <title>BioSync, Comprar plan</title>

      <nav className="planes-nav">
        <Link className="planes-logo" to="/">
          BioSync
        </Link>
        <div className="planes-nav-links">
          <Link to="/planes">Ver planes</Link>
        </div>
      </nav>

      <main className="compra">
        {enviado ? (
          <div className="compra-tarjeta compra-exito">
            <h1 ref={exitoRef} tabIndex={-1}>
              ¡Solicitud recibida!
            </h1>
            <p>
              Pediste el plan <strong>{enviado.plan.nombre}</strong> ({formatearPrecio(enviado.plan.precio)} / mes).
            </p>
            <p>
              Tu usuario se creará con el correo <strong>{enviado.email}</strong>. A ese correo te enviaremos tu
              contraseña y el método de pago. Revisa también la carpeta de spam.
            </p>
            <Link className="planes-comprar" to="/">
              Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="compra-tarjeta">
            <h1>Comprar plan</h1>

            {plan && (
              <div className="compra-resumen">
                <p className="compra-resumen-plan">
                  Plan {plan.nombre}: <strong>{formatearPrecio(plan.precio)}</strong> / mes
                </p>
                <p>{plan.descripcion}</p>
              </div>
            )}

            <form onSubmit={manejarEnvio} noValidate>
              <div className="compra-campo">
                <label htmlFor={`${id}-plan`}>Plan</label>
                <select {...props('plan')} value={valores.plan}>
                  <option value="">Elige un plan</option>
                  {PLANES_APP.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} · {formatearPrecio(p.precio)} / mes
                    </option>
                  ))}
                </select>
                {error('plan')}
              </div>

              <p className="compra-aviso" role="note">
                <strong>Importante:</strong> tu usuario se creará con el correo que escribas aquí, y a ese correo te
                enviaremos la contraseña y el método de pago. Asegúrate de que esté bien escrito.
              </p>

              <div className="compra-campo">
                <label htmlFor={`${id}-email`}>Correo</label>
                <input
                  {...props('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@correo.com"
                  maxLength={120}
                  value={valores.email}
                />
                {error('email')}
              </div>

              <div className="compra-campo">
                <label htmlFor={`${id}-confirmEmail`}>Confirma tu correo</label>
                <input
                  {...props('confirmEmail')}
                  type="email"
                  autoComplete="off"
                  placeholder="Escríbelo otra vez"
                  maxLength={120}
                  value={valores.confirmEmail}
                />
                {error('confirmEmail')}
              </div>

              <div className="compra-campo">
                <label htmlFor={`${id}-celular`}>Celular</label>
                <input
                  {...props('celular')}
                  type="tel"
                  autoComplete="tel-national"
                  inputMode="numeric"
                  placeholder="099 123 4567"
                  maxLength={14}
                  value={valores.celular}
                />
                {error('celular')}
                {avisoCelular && <p className="compra-recomendacion">{avisoCelular}</p>}
              </div>

              <div className="compra-campo compra-check">
                <input {...props('consentimiento')} type="checkbox" checked={valores.consentimiento} />
                <label htmlFor={`${id}-consentimiento`}>
                  Autorizo el tratamiento de mis datos personales (
                  <a href="/politica-datos" target="_blank" rel="noopener noreferrer">
                    ver política de datos
                  </a>
                  )
                </label>
              </div>
              {error('consentimiento')}

              {/* Campo trampa antispam: las personas no lo ven; si llega con texto, es un bot */}
              <div className="compra-trampa" aria-hidden="true">
                <label htmlFor={`${id}-website`}>Deja este campo vacío</label>
                <input
                  id={`${id}-website`}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={valores.website}
                  onChange={manejarCambio}
                />
              </div>

              {errorGeneral && (
                <p className="compra-error-general" role="alert">
                  {errorGeneral}
                </p>
              )}

              <button type="submit" className="planes-comprar compra-boton" disabled={enviando}>
                {enviando ? 'Enviando…' : 'Enviar solicitud'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default CheckoutPage
