import { useEffect, useState } from 'react'
import { nombrePlan } from '../../../../shared/planes.mjs'
import { useAuth } from '../../context/AuthContext.js'
import { useToast } from '../../context/ToastContext.js'
import { createUser, deleteUser, listUsers, updateUser } from '../../services/admin.js'
import { formatDate } from './formatDate.js'
import UserForm from './UserForm.jsx'

// Sección "Usuarios" del panel: crear, editar y borrar los usuarios del login.
// La API no deja que un admin se borre ni se quite el rol a sí mismo, ni que se quede sin admins.
function UsersPanel() {
  const { user: me, logout, updateUser: updateSessionUser } = useAuth()
  const showToast = useToast()

  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [editing, setEditing] = useState(null) // null, 'new' o el _id del usuario en edición
  const [busyId, setBusyId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  function handleError(error) {
    if (error.status === 401) logout()
    return error.message
  }

  useEffect(() => {
    let active = true
    listUsers()
      .then((list) => {
        if (!active) return
        setUsers(list)
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
    setEditing(null)
    setStatus('loading')
    setReloadKey((n) => n + 1)
  }

  // Si falla, el error vuelve al formulario para mostrarlo junto a los campos
  async function saveNew(data) {
    try {
      const created = await createUser(data)
      setUsers((list) => [created, ...list])
      setEditing(null)
      showToast('check', 'Usuario creado', created.email)
    } catch (error) {
      handleError(error)
      throw error
    }
  }

  async function saveChanges(target, data) {
    try {
      const updated = await updateUser(target._id, data)
      setUsers((list) => list.map((u) => (u._id === updated._id ? updated : u)))
      setEditing(null)
      // Si el admin se editó a sí mismo, se actualiza el correo y el nombre de su sesión
      if (target.email === me?.email) {
        updateSessionUser({ email: updated.email, nombre: updated.nombre, rol: updated.rol, plan: updated.plan })
      }
      showToast('check', 'Usuario actualizado', updated.email)
    } catch (error) {
      handleError(error)
      throw error
    }
  }

  async function remove(target) {
    setBusyId(target._id)
    try {
      await deleteUser(target._id)
      setUsers((list) => list.filter((u) => u._id !== target._id))
      showToast('check', 'Usuario borrado', target.email)
    } catch (error) {
      showToast('alert', 'No se pudo borrar', handleError(error))
    } finally {
      setBusyId(null)
      setConfirmId(null)
    }
  }

  const admins = users.filter((u) => u.rol === 'admin').length

  return (
    <section className="admin-section" aria-labelledby="admin-users-title">
      <div className="admin-toolbar">
        <h2 id="admin-users-title">Usuarios</h2>
        <div className="admin-toolbar-actions">
          <button
            type="button"
            className="btn"
            onClick={() => setEditing('new')}
            disabled={status !== 'ready' || editing === 'new'}
          >
            Nuevo usuario
          </button>
          <button type="button" className="btn admin-btn-secondary" onClick={reload} disabled={status === 'loading'}>
            Actualizar
          </button>
        </div>
      </div>

      {status === 'ready' && (
        <p className="admin-summary">
          {users.length} {users.length === 1 ? 'usuario' : 'usuarios'} · {admins} {admins === 1 ? 'admin' : 'admins'}
        </p>
      )}

      {editing === 'new' && (
        <div className="card admin-card">
          <UserForm onSave={saveNew} onCancel={() => setEditing(null)} />
        </div>
      )}

      {status === 'loading' && <p className="admin-state">Cargando usuarios…</p>}

      {status === 'error' && (
        <div className="admin-state">
          <p role="alert">{loadError}</p>
          <button type="button" className="btn" onClick={reload}>
            Reintentar
          </button>
        </div>
      )}

      {status === 'ready' && users.length === 0 && <p className="admin-state">No hay usuarios.</p>}

      {status === 'ready' && users.length > 0 && (
        <ul className="admin-list">
          {users.map((u) => {
            const isSelf = u.email === me?.email
            return (
              <li key={u._id} className="card admin-card">
                {editing === u._id ? (
                  <UserForm
                    user={u}
                    isSelf={isSelf}
                    onSave={(data) => saveChanges(u, data)}
                    onCancel={() => setEditing(null)}
                  />
                ) : (
                  <>
                    <div className="admin-card-top">
                      <h3>
                        {u.nombre}
                        {isSelf && <span className="admin-tag">Tú</span>}
                      </h3>
                      <span className={`admin-badge ${u.rol === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {u.rol === 'admin' ? 'Admin' : 'Usuario'}
                      </span>
                    </div>

                    <dl className="admin-data">
                      <dt>Correo</dt>
                      <dd>{u.email}</dd>
                      <dt>Plan</dt>
                      <dd>
                        {u.rol === 'admin' ? (
                          'Todos (admin)'
                        ) : u.plan ? (
                          nombrePlan(u.plan)
                        ) : (
                          <span className="admin-warning">Sin plan: no verá ningún perfil</span>
                        )}
                      </dd>
                      <dt>Creado</dt>
                      <dd>{formatDate(u.creadoEn)}</dd>
                    </dl>

                    <div className="admin-actions">
                      {confirmId === u._id ? (
                        <>
                          <span className="admin-confirm">¿Borrar a {u.email}? Ya no podrá ingresar.</span>
                          <button
                            type="button"
                            className="btn danger"
                            onClick={() => remove(u)}
                            disabled={busyId === u._id}
                          >
                            Sí, borrar
                          </button>
                          <button type="button" className="btn admin-btn-secondary" onClick={() => setConfirmId(null)}>
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="btn"
                            onClick={() => {
                              setConfirmId(null)
                              setEditing(u._id)
                            }}
                          >
                            Editar
                          </button>
                          {!isSelf && (
                            <button
                              type="button"
                              className="btn admin-btn-secondary"
                              onClick={() => setConfirmId(u._id)}
                              disabled={busyId === u._id}
                            >
                              Borrar
                            </button>
                          )}
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

export default UsersPanel
