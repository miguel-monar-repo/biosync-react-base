import { useState } from 'react'
import AudioBar from '../components/AudioBar.jsx'
import FamilyBar from '../components/FamilyBar.jsx'
import KidProfile from '../components/profiles/KidProfile.jsx'
import SeniorProfile from '../components/profiles/SeniorProfile.jsx'
import SportProfile from '../components/profiles/SportProfile.jsx'
import ProfileSidebar from '../components/ProfileSidebar.jsx'
import Topbar from '../components/Topbar.jsx'
import { AlertBannerProvider } from '../context/AlertBannerProvider.jsx'
import { FamilyProvider } from '../context/FamilyProvider.jsx'
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

// Los providers dan acceso al banner de alerta y a la familia a todo lo que está dentro
function DashboardPage() {
  return (
    <AlertBannerProvider>
      <FamilyProvider>
        <Dashboard />
      </FamilyProvider>
    </AlertBannerProvider>
  )
}

function Dashboard() {
  const [profile, setProfile] = useState('sport')
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

  return (
    <div className="app">
      <title>BioSync — Familia conectada desde el teléfono</title>
      <Topbar />
      <AudioBar audio={audio} />
      <FamilyBar />

      <div className="layout">
        <ProfileSidebar profile={profile} onChange={setProfile} />

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
