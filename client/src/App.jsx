import { Navigate, Route, Routes } from 'react-router'
import { ToastProvider } from './context/ToastProvider.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LandingPage from './pages/LandingPage.jsx'

// Rutas de la app:
//   /     → página de la marca (antes prototype/landing)
//   /app  → demo con los perfiles (antes prototype/app)
function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<DashboardPage />} />
        {/* Cualquier otra dirección vuelve al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  )
}

export default App
