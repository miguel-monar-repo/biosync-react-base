import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.js'
import { useToast } from '../../context/ToastContext.js'
import { deleteContact, listContacts, setContactAttended } from '../../services/admin.js'
import { formatDate } from './formatDate.js'

// Sección "Mensajes" del panel: mensajes del formulario de contacto.
// Permite marcarlos como atendidos o pendientes y borrarlos.
const FILTERS = [
  { id: 'todos', label: 'Todos', test: () => true },
  { id: 'pendientes', label: 'Pendientes', test: (c) => !c.atendido },
  { id: 'atendidos', label: 'Atendidos', test: (c) => c.atendido },
]

function ContactsPanel() {
  const { logout } = useAuth()
  const showToast = useToast()

  const [contacts, setContacts] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [filter, setFilter] = useState('pendientes')
  const [busyId, setBusyId] = useState(null) // mensaje con una acción en curso
  const [confirmId, setConfirmId] = useState(null) // mensaje que pide confirmar el borrado

  // Si la API dice que la sesión ya no sirve, se cierra y la ruta protegida saca del panel
  function handleError(error) {
    if (error.status === 401) logout()
    return error.message
  }

  useEffect(() => {
    let active = true
    listContacts()
      .then((list) => {
        if (!active) return
        setContacts(list)
        setStatus('ready')
      })
      .catch((error) => {
        if (!active) return
        setLoadError(handleError(error))
        setStatus('error')
      })
    return () => {
      active = false
    }
    // handleError solo depende de logout; recargar solo cuando se pide con reloadKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey])

  function reload() {
    setStatus('loading')
    setReloadKey((n) => n + 1)
  }

  async function toggleAttended(contact) {
    setBusyId(contact._id)
    try {
      const updated = await setContactAttended(contact._id, !contact.atendido)
      setContacts((list) => list.map((c) => (c._id === updated._id ? updated : c)))
      showToast('check', updated.atendido ? 'Marcado como atendido' : 'Marcado como pendiente', updated.nombre)
    } catch (error) {
      showToast('alert', 'No se pudo actualizar', handleError(error))
    } finally {
      setBusyId(null)
    }
  }

  async function remove(contact) {
    setBusyId(contact._id)
    try {
      await deleteContact(contact._id)
      setContacts((list) => list.filter((c) => c._id !== contact._id))
      showToast('check', 'Mensaje borrado', contact.nombre)
    } catch (error) {
      showToast('alert', 'No se pudo borrar', handleError(error))
    } finally {
      setBusyId(null)
      setConfirmId(null)
    }
  }

  const activeFilter = FILTERS.find((f) => f.id === filter)
  const visible = contacts.filter(activeFilter.test)

  return (
    <section className="admin-section" aria-labelledby="admin-contacts-title">
      <div className="admin-toolbar">
        <h2 id="admin-contacts-title">Mensajes del formulario</h2>
        <button type="button" className="btn" onClick={reload} disabled={status === 'loading'}>
          Actualizar
        </button>
      </div>

      <div className="admin-filters" role="group" aria-label="Filtrar mensajes">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`admin-filter${filter === f.id ? ' active' : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label} <span className="admin-count">{contacts.filter(f.test).length}</span>
          </button>
        ))}
      </div>

      {status === 'loading' && <p className="admin-state">Cargando mensajes…</p>}

      {status === 'error' && (
        <div className="admin-state">
          <p role="alert">{loadError}</p>
          <button type="button" className="btn" onClick={reload}>
            Reintentar
          </button>
        </div>
      )}

      {status === 'ready' && visible.length === 0 && (
        <p className="admin-state">No hay mensajes {filter === 'todos' ? '' : activeFilter.label.toLowerCase()}.</p>
      )}

      {status === 'ready' && visible.length > 0 && (
        <ul className="admin-list">
          {visible.map((c) => (
            <li key={c._id} className="card admin-card">
              <div className="admin-card-top">
                <h3>{c.nombre}</h3>
                <span className={`admin-badge${c.atendido ? ' done' : ''}`}>
                  {c.atendido ? 'Atendido' : 'Pendiente'}
                </span>
              </div>
              <p className="admin-date">{formatDate(c.creadoEn)}</p>

              <dl className="admin-data">
                <dt>Correo</dt>
                <dd>
                  <a href={`mailto:${c.email}`}>{c.email}</a>
                </dd>
                <dt>Celular</dt>
                <dd>
                  <a href={`tel:${c.celular}`}>{c.celular}</a>
                </dd>
                <dt>Plan</dt>
                <dd>{c.planInteres || 'Sin indicar'}</dd>
              </dl>

              <p className="admin-message">{c.mensaje}</p>

              <div className="admin-actions">
                {confirmId === c._id ? (
                  <>
                    <span className="admin-confirm">¿Borrar este mensaje?</span>
                    <button type="button" className="btn danger" onClick={() => remove(c)} disabled={busyId === c._id}>
                      Sí, borrar
                    </button>
                    <button type="button" className="btn admin-btn-secondary" onClick={() => setConfirmId(null)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn" onClick={() => toggleAttended(c)} disabled={busyId === c._id}>
                      {c.atendido ? 'Marcar como pendiente' : 'Marcar como atendido'}
                    </button>
                    <button
                      type="button"
                      className="btn admin-btn-secondary"
                      onClick={() => setConfirmId(c._id)}
                      disabled={busyId === c._id}
                    >
                      Borrar
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ContactsPanel
