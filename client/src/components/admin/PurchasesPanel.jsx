import { useEffect, useState } from 'react'
import { buscarPlan, formatearPrecio } from '../../../../shared/planes.mjs'
import { usePlans } from '../../context/PlansContext.js'
import { useAuth } from '../../context/AuthContext.js'
import { useToast } from '../../context/ToastContext.js'
import { createUser, deletePurchase, listPurchases, setPurchaseAttended } from '../../services/admin.js'
import { formatDate } from './formatDate.js'
import UserForm from './UserForm.jsx'

// Sección "Compras" del panel: solicitudes del formulario /comprar.
// Desde aquí se crea el usuario con el correo y el plan de la solicitud (con "Generar" se
// obtiene una contraseña). El correo con la contraseña y el método de pago lo envía el equipo.
const FILTERS = [
  { id: 'todas', label: 'Todas', test: () => true },
  { id: 'pendientes', label: 'Pendientes', test: (c) => !c.atendida },
  { id: 'atendidas', label: 'Atendidas', test: (c) => c.atendida },
]

function PurchasesPanel() {
  const { logout } = useAuth()
  const showToast = useToast()
  const { plans } = usePlans() // para mostrar el nombre y el precio del plan de cada solicitud

  const [purchases, setPurchases] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [filter, setFilter] = useState('pendientes')
  const [creatingFor, setCreatingFor] = useState(null) // solicitud con el formulario de usuario abierto
  const [busyId, setBusyId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  function handleError(error) {
    if (error.status === 401) logout()
    return error.message
  }

  useEffect(() => {
    let active = true
    listPurchases()
      .then((list) => {
        if (!active) return
        setPurchases(list)
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
    setCreatingFor(null)
    setStatus('loading')
    setReloadKey((n) => n + 1)
  }

  async function markAttended(purchase, atendida) {
    const updated = await setPurchaseAttended(purchase._id, atendida)
    setPurchases((list) => list.map((c) => (c._id === updated._id ? updated : c)))
    return updated
  }

  async function toggleAttended(purchase) {
    setBusyId(purchase._id)
    try {
      const updated = await markAttended(purchase, !purchase.atendida)
      showToast('check', updated.atendida ? 'Marcada como atendida' : 'Marcada como pendiente', updated.email)
    } catch (error) {
      showToast('alert', 'No se pudo actualizar', handleError(error))
    } finally {
      setBusyId(null)
    }
  }

  // Crea el usuario y, si sale bien, marca la solicitud como atendida
  async function createUserFor(purchase, data) {
    try {
      const created = await createUser(data)
      setCreatingFor(null)
      await markAttended(purchase, true).catch(() => {})
      showToast('check', 'Usuario creado', `${created.email}. Envíale su contraseña y el método de pago.`)
    } catch (error) {
      handleError(error)
      throw error // el formulario muestra el error (por ejemplo, correo ya registrado)
    }
  }

  async function remove(purchase) {
    setBusyId(purchase._id)
    try {
      await deletePurchase(purchase._id)
      setPurchases((list) => list.filter((c) => c._id !== purchase._id))
      showToast('check', 'Solicitud borrada', purchase.email)
    } catch (error) {
      showToast('alert', 'No se pudo borrar', handleError(error))
    } finally {
      setBusyId(null)
      setConfirmId(null)
    }
  }

  const activeFilter = FILTERS.find((f) => f.id === filter)
  const visible = purchases.filter(activeFilter.test)

  return (
    <section className="admin-section" aria-labelledby="admin-purchases-title">
      <div className="admin-toolbar">
        <h2 id="admin-purchases-title">Solicitudes de compra</h2>
        <button type="button" className="btn" onClick={reload} disabled={status === 'loading'}>
          Actualizar
        </button>
      </div>

      <div className="admin-filters" role="group" aria-label="Filtrar solicitudes">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`admin-filter${filter === f.id ? ' active' : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label} <span className="admin-count">{purchases.filter(f.test).length}</span>
          </button>
        ))}
      </div>

      {status === 'loading' && <p className="admin-state">Cargando solicitudes…</p>}

      {status === 'error' && (
        <div className="admin-state">
          <p role="alert">{loadError}</p>
          <button type="button" className="btn" onClick={reload}>
            Reintentar
          </button>
        </div>
      )}

      {status === 'ready' && visible.length === 0 && (
        <p className="admin-state">
          No hay solicitudes {filter === 'todas' ? '' : activeFilter.label.toLowerCase()}.
        </p>
      )}

      {status === 'ready' && visible.length > 0 && (
        <ul className="admin-list">
          {visible.map((c) => {
            const plan = buscarPlan(plans, c.plan)
            return (
              <li key={c._id} className="card admin-card">
                {creatingFor === c._id ? (
                  <UserForm
                    defaults={{ email: c.email, rol: 'usuario', plan: c.plan }}
                    onSave={(data) => createUserFor(c, data)}
                    onCancel={() => setCreatingFor(null)}
                  />
                ) : (
                  <>
                    <div className="admin-card-top">
                      <h3>{c.email}</h3>
                      <span className={`admin-badge${c.atendida ? ' done' : ''}`}>
                        {c.atendida ? 'Atendida' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="admin-date">{formatDate(c.creadoEn)}</p>

                    <dl className="admin-data">
                      <dt>Plan</dt>
                      <dd>{plan ? `${plan.nombre} · ${formatearPrecio(plan.precio)} / mes` : c.plan}</dd>
                      <dt>Celular</dt>
                      <dd>
                        <a href={`tel:${c.celular}`}>{c.celular}</a>
                      </dd>
                      <dt>Correo</dt>
                      <dd>
                        <a href={`mailto:${c.email}`}>{c.email}</a>
                      </dd>
                    </dl>

                    <div className="admin-actions">
                      {confirmId === c._id ? (
                        <>
                          <span className="admin-confirm">¿Borrar esta solicitud?</span>
                          <button
                            type="button"
                            className="btn danger"
                            onClick={() => remove(c)}
                            disabled={busyId === c._id}
                          >
                            Sí, borrar
                          </button>
                          <button type="button" className="btn admin-btn-secondary" onClick={() => setConfirmId(null)}>
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          {!c.atendida && (
                            <button
                              type="button"
                              className="btn"
                              onClick={() => {
                                setConfirmId(null)
                                setCreatingFor(c._id)
                              }}
                            >
                              Crear usuario
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn admin-btn-secondary"
                            onClick={() => toggleAttended(c)}
                            disabled={busyId === c._id}
                          >
                            {c.atendida ? 'Marcar como pendiente' : 'Marcar como atendida'}
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
                  </>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default PurchasesPanel
