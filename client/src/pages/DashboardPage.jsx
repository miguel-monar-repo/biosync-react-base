import { useState } from 'react'
import { nombrePlan, perfilesPermitidos, TODOS_LOS_PERFILES } from '../../../shared/planes.mjs'
import AudioBar from '../components/AudioBar.jsx'
import FamilyBar from '../components/FamilyBar.jsx'
import KidProfile from '../components/profiles/KidProfile.jsx'
import SeniorProfile from '../components/profiles/SeniorProfile.jsx'
import SportProfile from '../components/profiles/SportProfile.jsx'
import ProfileSidebar from '../components/ProfileSidebar.jsx'
import Topbar from '../components/Topbar.jsx'
import { AlertBannerProvider } from '../context/AlertBannerProvider.jsx'
import { useAuth } from '../context/AuthContext.js'
import { FamilyProvider } from '../context/FamilyProvider.jsx'
import { usePlans } from '../context/PlansContext.js'
import { useAudioStatus } from '../hooks/useAudioStatus.js'
import { useBattery } from '../hooks/useBattery.js'
import { useFallDetection } from '../hooks/useFallDetection.js'
import { useKidMessages } from '../hooks/useKidMessages.js'
import { useRealLocation } from '../hooks/useRealLocation.js'
import { useRouteTracker } from '../hooks/useRouteTracker.js'
import { useStepCounter } from '../hooks/useStepCounter.js'
import './DashboardPage.css'

// Medicamentos de ejemplo
const DEMO_MEDS = [
  { name: 'Losartán 50mg', time: '08:00', done: true },
  { name: 'Metformina 850mg', time: '13:00', done: true },
  { name: 'Vitamina D', time: '20:00', done: false },
]

// La misma pantalla sirve para dos rutas:
//   /demo (demo={true}): pública, sin login, con todos los perfiles ("Probar la demo")
//   /app: con login; cada usuario ve solo los perfiles de su plan (los planes vienen de MongoDB)
// Los providers dan acceso al banner de alerta y a la familia a todo lo que está dentro
function DashboardPage({ demo = false }) {
  return (
    <AlertBannerProvider>
      <FamilyProvider>
        <Dashboard demo={demo} />
      </FamilyProvider>
    </AlertBannerProvider>
  )
}

function Dashboard({ demo }) {
  const { user } = useAuth()
  const { plans, status: plansStatus, retry: retryPlans } = usePlans()
  // La demo y los admin ven todos los perfiles; el resto, los de su plan
  const allowed = demo ? TODOS_LOS_PERFILES : perfilesPermitidos(user, plans)
  // Un usuario normal necesita los planes de la base para saber qué perfil ver
  const needsPlans = !demo && user?.rol !== 'admin'
  const [selected, setSelected] = useState(allowed[0] ?? null)
  // Si el plan cambia mientras la app está abierta, se vuelve a un perfil permitido
  const profile = allowed.includes(selected) ? selected : allowed[0]
  const [meds, setMeds] = useState(DEMO_MEDS)

  // Los sensores viven aquí (y no dentro de cada perfil) para que sigan
  // funcionando aunque cambies de perfil, igual que en el prototipo
  const audio = useAudioStatus()
  const battery = useBattery()
  const stepCounter = useStepCounter()
  const route = useRouteTracker()
  const fall = useFallDetection()
  const seniorLocation = useRealLocation('senior')
  const kidLocation = useRealLocation('kid')
  const kidMessages = useKidMessages()

  function toggleMed(index) {
    setMeds((list) => list.map((m, i) => (i === index ? { ...m, done: !m.done } : m)))
  }

  // Mientras llegan los planes (o si no cargan), un aviso en lugar de los perfiles
  if (needsPlans && plansStatus !== 'ready') {
    return (
      <div className="app">
        <title>BioSync — Familia conectada desde el teléfono</title>
        <Topbar showSession />
        <main className="dashboard">
          <div className="card no-plan">
            {plansStatus === 'loading' ? (
              <p>Cargando tu plan…</p>
            ) : (
              <>
                <h2>No pudimos cargar tu plan</h2>
                <p>Revisa tu conexión e inténtalo de nuevo.</p>
                <button type="button" className="btn" onClick={retryPlans}>
                  Reintentar
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    )
  }

  // Usuario sin plan asignado (o con un plan que ya no está activo): no ve ningún perfil
  if (allowed.length === 0) {
    return (
      <div className="app">
        <title>BioSync — Familia conectada desde el teléfono</title>
        <Topbar showSession />
        <main className="dashboard">
          <div className="card no-plan">
            <h2>Tu cuenta no tiene un plan asignado</h2>
            <p>Pide al equipo de BioSync que te asigne un plan para ver tu perfil en la app.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <title>BioSync — Familia conectada desde el teléfono</title>
      {/* En la demo no hay sesión: en lugar del correo y "Cerrar sesión", hay "Volver al inicio"
          y una invitación a ver los planes */}
      <Topbar showSession={!demo} demo={demo} />
      <AudioBar audio={audio} />
      <FamilyBar />

      <div className="layout">
        <ProfileSidebar
          profiles={allowed}
          profile={profile}
          onChange={setSelected}
          planName={demo || user?.rol === 'admin' ? null : nombrePlan(plans, user?.plan)}
        />

        <main className="dashboard">
          {profile === 'sport' && <SportProfile stepCounter={stepCounter} route={route} />}
          {profile === 'senior' && (
            <SeniorProfile
              meds={meds}
              onToggleMed={toggleMed}
              location={seniorLocation}
              fall={fall}
              battery={battery}
            />
          )}
          {profile === 'kid' && (
            <KidProfile location={kidLocation} messages={kidMessages} playAudio={audio.play} battery={battery} />
          )}
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
