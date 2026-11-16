import { useState } from 'react'
import { Link } from 'react-router'
import ContactsPanel from '../components/admin/ContactsPanel.jsx'
import PurchasesPanel from '../components/admin/PurchasesPanel.jsx'
import UsersPanel from '../components/admin/UsersPanel.jsx'
import { useAuth } from '../context/AuthContext.js'
// Reutiliza los botones (.btn) y tarjetas (.card) de la app
import './DashboardPage.css'
import './AdminPage.css'

// Panel de administración (ruta /admin, solo rol admin). No hay enlaces hacia aquí:
// se entra escribiendo la dirección. Secciones: mensajes del formulario, solicitudes de compra y usuarios.
const SECTIONS = [
  { id: 'mensajes', label: 'Mensajes', Panel: ContactsPanel },
  { id: 'compras', label: 'Compras', Panel: PurchasesPanel },
  { id: 'usuarios', label: 'Usuarios', Panel: UsersPanel },
]

function AdminPage() {
  const { user, logout } = useAuth()
  const [section, setSection] = useState('mensajes')

  return (
    <div className="admin">
      <title>BioSync, Panel de administración</title>

      <header className="admin-header">
        <div>
          <h1>Panel de administración</h1>
          <p className="admin-user">{user?.email}</p>
        </div>
        <nav className="admin-nav">
          <Link className="btn admin-btn-secondary" to="/app">
            Ir a la app
          </Link>
          <button type="button" className="btn admin-btn-secondary" onClick={logout}>
            Cerrar sesión
          </button>
        </nav>
      </header>

      <main className="admin-main">
        <div className="admin-tabs" role="group" aria-label="Secciones del panel">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`admin-tab${section === s.id ? ' active' : ''}`}
              aria-pressed={section === s.id}
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {SECTIONS.filter((s) => s.id === section).map(({ id, Panel }) => (
          <Panel key={id} />
        ))}
      </main>
    </div>
  )
}

export default AdminPage
