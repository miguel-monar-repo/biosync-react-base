import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext.js'
import './ProtectedRoute.css'

// Envuelve una página que necesita sesión (la app). Sin sesión, manda al login
// y le avisa a qué página volver después de ingresar.
function ProtectedRoute({ children }) {
  const { status, retry } = useAuth()
  const location = useLocation()

  if (status === 'signed-in') return children

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
