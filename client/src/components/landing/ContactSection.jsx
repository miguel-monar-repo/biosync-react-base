import { useEffect, useId, useRef, useState } from 'react'
import { PLANES, reglas } from '../../../../shared/validacionContacto.js'
import './ContactSection.css'

// Sección de contacto de la landing: texto a la izquierda y tarjeta con el formulario.
// Valida con las mismas reglas que el servidor (shared/validacionContacto.js) y envía a POST /api/contact.
const CAMPOS = ['nombre', 'email', 'celular', 'planInteres', 'mensaje', 'consentimiento']
const ERROR_ENVIO = 'No pudimos enviar tu mensaje. Revisa tu conexión e inténtalo de nuevo.'
const VALORES_INICIALES = {
  nombre: '',
  email: '',
  celular: '',
  planInteres: '',
  mensaje: '',
  consentimiento: false,
  website: '',
}

function ContactSection({
  id: seccionId = 'contacto',
  titulo = 'Hablemos',
  texto = '¿Tienes dudas sobre nuestros planes? Déjanos tus datos y un mensaje, y te contactaremos pronto.',
  politicaUrl = '/politica-datos',
  apiUrl = '/api/contact',
}) {
  // useId() crea ids únicos para que no choquen con otros de la página
  const id = useId()
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [nombreEnviado, setNombreEnviado] = useState(null)

  const exitoRef = useRef(null)
  const volviendo = useRef(false)

  // Los ids ya son únicos (useId), así que se usan para llevar el foco a un campo
  function enfocar(campo) {
    document.getElementById(`${id}-${campo}`)?.focus()
  }

  // Foco al título de éxito, o al nombre al volver con "Enviar otro mensaje"
  useEffect(() => {
    if (nombreEnviado) {
      exitoRef.current?.focus()
    } else if (volviendo.current) {
      volviendo.current = false
      document.getElementById(`${id}-nombre`)?.focus()
    }
  }, [nombreEnviado, id])

  function validarCampo(campo, valor) {
    const { error } = reglas[campo](valor)
    setErrores((prev) => ({ ...prev, [campo]: error }))
    return error
  }

  function manejarCambio(e) {
    const { name, type, value, checked, tagName } = e.target
    const valor = type === 'checkbox' ? checked : value
    setValores((prev) => ({ ...prev, [name]: valor }))

    if (name === 'website') return
    // Checkbox y select se validan al cambiar; el resto, solo si ya tenían error
    if (type === 'checkbox' || tagName === 'SELECT' || errores[name]) {
      validarCampo(name, valor)
    }
  }

  function manejarBlur(e) {
    const { name, type, tagName } = e.target
    if (type === 'checkbox' || tagName === 'SELECT') return
    validarCampo(name, valores[name])
  }

  function enfocarPrimerError(lista) {
    const primero = CAMPOS.find((campo) => lista[campo])
    if (primero) enfocar(primero)
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    if (enviando) return
    setErrorGeneral('')

    const nuevos = {}
    for (const campo of CAMPOS) {
      const { error } = reglas[campo](valores[campo])
      if (error) nuevos[campo] = error
    }
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) {
      enfocarPrimerError(nuevos)
      return
    }

    setEnviando(true)
    try {
      const respuesta = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valores),
      })
      const resultado = await respuesta.json().catch(() => ({}))

      if (respuesta.status === 201) {
        setNombreEnviado(reglas.nombre(valores.nombre).valor)
      } else if (respuesta.status === 400 && resultado.errores) {
        setErrores(resultado.errores)
        enfocarPrimerError(resultado.errores)
      } else if (respuesta.status === 429 && resultado.error) {
        setErrorGeneral(resultado.error)
      } else {
        setErrorGeneral(ERROR_ENVIO)
      }
    } catch {
      setErrorGeneral(ERROR_ENVIO)
    } finally {
      setEnviando(false)
    }
  }

  function enviarOtro() {
    volviendo.current = true
    setValores(VALORES_INICIALES)
    setErrores({})
    setErrorGeneral('')
    setNombreEnviado(null)
  }

  // Props comunes de cada campo: id, eventos y atributos de accesibilidad
  const props = (campo) => ({
    id: `${id}-${campo}`,
    name: campo,
    onChange: manejarCambio,
    onBlur: manejarBlur,
    'aria-invalid': errores[campo] ? 'true' : undefined,
    'aria-describedby': `${id}-error-${campo}`,
  })

  const error = (campo) => (
    <p className="campo-error" id={`${id}-error-${campo}`}>
      {errores[campo]}
    </p>
  )

  return (
    <section id={seccionId} className="seccion-contacto">
      <div className="contacto">
        <div className="contacto-intro">
          <h2 className="contacto-titulo">{titulo}</h2>
          <p>{texto}</p>
        </div>

        <div className="tarjeta">
          {nombreEnviado ? (
            <div className="exito">
              <h3 ref={exitoRef} tabIndex={-1}>
                ¡Gracias, {nombreEnviado}!
              </h3>
              <p>Recibimos tu mensaje y te contactaremos pronto.</p>
              <button type="button" className="boton" onClick={enviarOtro}>
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <>
              <h3>Escríbenos</h3>
              <form onSubmit={manejarEnvio} noValidate>
                <div className="campo">
                  <label htmlFor={`${id}-nombre`}>Nombre</label>
                  <input
                    {...props('nombre')}
                    type="text"
                    autoComplete="name"
                    placeholder="Ej.: Paula Gómez"
                    maxLength={60}
                    required
                    value={valores.nombre}
                  />
                  {error('nombre')}
                </div>

                <div className="campo">
                  <label htmlFor={`${id}-email`}>Correo</label>
                  <input
                    {...props('email')}
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@correo.com"
                    maxLength={120}
                    required
                    value={valores.email}
                  />
                  {error('email')}
                </div>

                <div className="campo">
                  <label htmlFor={`${id}-celular`}>Celular</label>
                  <input
                    {...props('celular')}
                    type="tel"
                    autoComplete="tel-national"
                    inputMode="numeric"
                    placeholder="300 123 4567"
                    maxLength={14}
                    required
                    value={valores.celular}
                  />
                  {error('celular')}
                </div>

                <div className="campo">
                  <label htmlFor={`${id}-planInteres`}>
                    Plan de interés <span className="opcional">(opcional)</span>
                  </label>
                  <select {...props('planInteres')} value={valores.planInteres}>
                    <option value="">Selecciona un plan</option>
                    {PLANES.map((plan) => (
                      <option key={plan}>{plan}</option>
                    ))}
                  </select>
                  {error('planInteres')}
                </div>

                <div className="campo">
                  <label htmlFor={`${id}-mensaje`}>Mensaje</label>
                  <textarea
                    {...props('mensaje')}
                    rows={5}
                    maxLength={1000}
                    required
                    aria-describedby={`${id}-error-mensaje ${id}-contador`}
                    value={valores.mensaje}
                  />
                  <div className="campo-pie">
                    {error('mensaje')}
                    <span className="contador" id={`${id}-contador`}>
                      {valores.mensaje.length}/1000
                    </span>
                  </div>
                </div>

                <div className="campo">
                  <div className="check">
                    <input {...props('consentimiento')} type="checkbox" required checked={valores.consentimiento} />
                    <label htmlFor={`${id}-consentimiento`}>
                      Autorizo el tratamiento de mis datos personales (
                      <a href={politicaUrl} target="_blank" rel="noopener noreferrer">
                        ver política de datos
                      </a>
                      )
                    </label>
                  </div>
                  {error('consentimiento')}
                </div>

                {/* Campo trampa antispam: las personas no lo ven; si llega con texto, es un bot */}
                <div className="trampa" aria-hidden="true">
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
                  <p className="error-general" role="alert">
                    {errorGeneral}
                  </p>
                )}

                <button type="submit" className={`boton${enviando ? ' enviando' : ''}`} disabled={enviando}>
                  <span className="spinner" aria-hidden="true" />
                  <span>{enviando ? 'Enviando…' : 'Enviar mensaje'}</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContactSection
