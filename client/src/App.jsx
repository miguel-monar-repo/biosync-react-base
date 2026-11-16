import { Navigate, Route, Routes, useLocation } from 'react-router'
import ChatWidget from './components/ChatWidget.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ToastProvider } from './context/ToastProvider.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PlansPage from './pages/PlansPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'

// Rutas de la app:
//   /               → página de la marca (antes prototype/landing)
//   /login          → ingreso a la app (correo y contraseña)
//   /demo           → demo pública con los 3 perfiles, sin login ("Probar la demo")
//   /planes         → planes y precios
//   /comprar        → formulario de compra (?plan=deportivo, etc.)
//   /app            → la app (antes prototype/app). Necesita sesión; muestra solo el plan del usuario
//   /admin          → panel de administración. Necesita sesión con rol admin
//   /politica-datos → aviso sobre los datos del formulario de contacto
function App() {
  // Cada vez que cambia la página, el contenedor se vuelve a crear (key) y la página aparece con
  // un fundido suave (ver styles/animations.css)
  const { pathname } = useLocation()

  return (
    <ToastProvider>
      <AuthProvider>
        <div key={pathname} className="page-transition">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/demo" element={<DashboardPage demo />} />
            <Route path="/planes" element={<PlansPage />} />
            <Route path="/comprar" element={<CheckoutPage />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="/politica-datos" element={<PrivacyPage />} />
            {/* Cualquier otra dirección vuelve al inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        {/* Asistente virtual: botón flotante en todas las páginas (se oculta solo en el panel) */}
        <ChatWidget />
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
