import { Navigate, Route, Routes } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ToastProvider } from './context/ToastProvider.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'

// Rutas de la app:
//   /               → página de la marca (antes prototype/landing)
//   /login          → ingreso a la app (correo y contraseña)
//   /app            → demo con los perfiles (antes prototype/app). Necesita sesión
//   /politica-datos → aviso sobre los datos del formulario de contacto
function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/politica-datos" element={<PrivacyPage />} />
          {/* Cualquier otra dirección vuelve al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
