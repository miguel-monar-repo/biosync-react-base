import Icon from './Icon.jsx'
import RealChip from './RealChip.jsx'

const PROFILES = [
  { id: 'sport', label: 'Deportivo', icon: 'activity' },
  { id: 'senior', label: 'Adulto mayor', icon: 'ecg' },
  { id: 'kid', label: 'Niño', icon: 'shield' },
]

function ProfileSidebar({ profile, onChange }) {
  return (
    <aside className="sidebar">
      <h3>Perfiles</h3>
      <div className="profile-rail">
        {PROFILES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`profile-btn${profile === p.id ? ' active' : ''}`}
            aria-pressed={profile === p.id}
            onClick={() => onChange(p.id)}
          >
            <Icon name={p.icon} /> {p.label}
          </button>
        ))}
      </div>
      <div className="sidebar-note">
        Todo lo marcado <RealChip /> usa sensores de verdad de este teléfono: pasos, ubicación, caídas,
        inactividad y batería. Lo demás son datos de ejemplo para la demo.
      </div>
    </aside>
  )
}

export default ProfileSidebar
