import { useId, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.js'
import './LoginPage.css'

// Login de la app (ruta /login). Los usuarios se crean con el script api/scripts/crear-usuario.js
function LoginPage() {
  const id = useId()
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // Página a la que se quería entrar antes de ser enviado al login (por defecto, la app)
  const destino = location.state?.from || '/app'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Si ya hay sesión, no tiene sentido mostrar el login
  if (status === 'signed-in') return <Navigate to={destino} replace />

  async function manejarEnvio(e) {
    e.preventDefault()
    if (enviando) return
    if (!email.trim() || !password) {
      setError('Escribe tu correo y tu contraseña.')
      return
    }

    setError('')
    setEnviando(true)
    try {
      await login(email, password)
      navigate(destino, { replace: true })
    } catch (err) {
      // El mensaje viene de la API (correo o contraseña incorrectos, demasiados intentos...)
      setError(err.message)
      setEnviando(false)
    }
  }

  return (
    <main className="login">
      <title>BioSync, Ingresar</title>

      <div className="login-tarjeta">
        <h1>Ingresar a la app</h1>
        <p className="login-intro">Usa el correo y la contraseña que te dio el equipo de BioSync.</p>

        <form onSubmit={manejarEnvio} noValidate>
          <div className="login-campo">
            <label htmlFor={`${id}-email`}>Correo</label>
            <input
              id={`${id}-email`}
              type="email"
              autoComplete="email"
              placeholder="nombre@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={`${id}-error`}
            />
          </div>

          <div className="login-campo">
            <label htmlFor={`${id}-password`}>Contraseña</label>
            <input
              id={`${id}-password`}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={`${id}-error`}
            />
          </div>

          <p className="login-error" id={`${id}-error`} role="alert">
            {error}
          </p>

          <button type="submit" className="login-boton" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <Link className="login-volver" to="/">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}

export default LoginPage
