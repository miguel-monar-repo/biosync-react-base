import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext.js'
import './ProtectedRoute.css'

// Envuelve una página que necesita sesión. Sin sesión, manda al login y le avisa
// a qué página volver después de ingresar.
//
// Con `role` (por ejemplo "admin") la página queda oculta: a quien no tenga una sesión con ese rol
// se le trata igual que en una dirección que no existe (vuelve a la portada), para no revelar que
// la página está ahí. Esto solo oculta la pantalla: la protección real de los datos está en la API.
function ProtectedRoute({ children, role }) {
  const { status, user, retry } = useAuth()
  const location = useLocation()

  if (status === 'signed-in' && (!role || user.rol === role)) return children

  if (role && (status === 'signed-in' || status === 'signed-out')) {
    return <Navigate to="/" replace />
  }

  if (status === 'signed-out') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <main className="auth-check">
      {status === 'error' ? (
        <>
          <p role="alert">No pudimos verificar tu sesión. Revisa tu conexión.</p>
          <button type="button" className="auth-check-btn" onClick={retry}>
            Reintentar
          </button>
        </>
      ) : (
        <p>Verificando sesión…</p>
      )}
    </main>
  )
}

export default ProtectedRoute
