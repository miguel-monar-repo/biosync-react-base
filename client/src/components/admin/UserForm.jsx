import { useId, useState } from 'react'
import { PLANES_APP } from '../../../../shared/planes.mjs'

// Formulario para crear un usuario (sin `user`) o editarlo (con `user`).
// `onSave(datos)` recibe solo lo que hay que enviar a la API; si la API responde con errores,
// se muestran debajo de cada campo. Al editar, la contraseña vacía significa "no cambiarla".
// El plan solo se pide para el rol "usuario": los admin ven todos los perfiles.
const EMPTY = { email: '', nombre: '', rol: 'usuario', plan: '', contrasena: '' }

// Contraseña aleatoria de 16 caracteres, generada en el navegador
function generatePassword() {
  const bytes = crypto.getRandomValues(new Uint8Array(12))
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

// `defaults`: al crear, datos que ya vienen llenos (por ejemplo, el correo y el plan de una compra)
function UserForm({ user, defaults, isSelf = false, onSave, onCancel }) {
  const id = useId()
  const isNew = !user
  const initial = user ? { ...EMPTY, ...user, plan: user.plan ?? '', contrasena: '' } : { ...EMPTY, ...defaults }
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [saving, setSaving] = useState(false)

  function change(e) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  async function submit(e) {
    e.preventDefault()
    if (saving) return

    // Al editar se envía solo lo que cambió (y la contraseña solo si se escribió una)
    const fields = ['email', 'nombre', 'rol', 'plan', 'contrasena']
    const data = Object.fromEntries(
      fields
        .filter((f) => (isNew ? true : f === 'contrasena' ? values.contrasena !== '' : values[f] !== initial[f]))
        .map((f) => [f, values[f]]),
    )
    if (!isNew && Object.keys(data).length === 0) {
      onCancel()
      return
    }

    setSaving(true)
    setErrors({})
    setGeneralError('')
    try {
      await onSave(data) // si sale bien, el panel cierra el formulario
    } catch (error) {
      setErrors(error.errores || {})
      setGeneralError(error.message)
      setSaving(false)
    }
  }

  // Propiedades de accesibilidad de cada campo (borde rojo y mensaje de error enlazado)
  const fieldProps = (name) => ({
    id: `${id}-${name}`,
    name,
    value: values[name],
    onChange: change,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': `${id}-${name}-help`,
  })

  return (
    <form className="admin-form" onSubmit={submit} noValidate>
      <h3>{isNew ? 'Nuevo usuario' : `Editar: ${user.nombre}`}</h3>

      <div className="admin-field">
        <label htmlFor={`${id}-email`}>Correo</label>
        <input {...fieldProps('email')} type="email" autoComplete="off" placeholder="nombre@correo.com" />
        <p className="admin-field-error" id={`${id}-email-help`}>
          {errors.email}
        </p>
      </div>

      <div className="admin-field">
        <label htmlFor={`${id}-nombre`}>Nombre</label>
        <input {...fieldProps('nombre')} type="text" autoComplete="off" maxLength={60} placeholder="Ej.: Paula Gómez" />
        <p className="admin-field-error" id={`${id}-nombre-help`}>
          {errors.nombre}
        </p>
      </div>

      <div className="admin-field">
        <label htmlFor={`${id}-rol`}>Rol</label>
        <select {...fieldProps('rol')} disabled={isSelf}>
          <option value="usuario">Usuario (solo la app)</option>
          <option value="admin">Admin (app y panel)</option>
        </select>
        <p className="admin-field-error" id={`${id}-rol-help`}>
          {errors.rol || (isSelf ? 'No puedes cambiar tu propio rol.' : '')}
        </p>
      </div>

      {values.rol === 'usuario' && (
        <div className="admin-field">
          <label htmlFor={`${id}-plan`}>Plan</label>
          <select {...fieldProps('plan')}>
            <option value="">Elige un plan</option>
            {PLANES_APP.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
          <p className="admin-field-error" id={`${id}-plan-help`}>
            {errors.plan || 'En la app verá solo el perfil de su plan. Familiar ve los tres perfiles.'}
          </p>
        </div>
      )}

      <div className="admin-field">
        <label htmlFor={`${id}-contrasena`}>{isNew ? 'Contraseña' : 'Contraseña nueva'}</label>
        <div className="admin-input-row">
          <input {...fieldProps('contrasena')} type="text" autoComplete="new-password" spellCheck={false} />
          <button
            type="button"
            className="btn admin-btn-secondary"
            onClick={() => setValues((v) => ({ ...v, contrasena: generatePassword() }))}
          >
            Generar
          </button>
        </div>
        <p className="admin-field-error" id={`${id}-contrasena-help`}>
          {errors.contrasena ||
            (isNew
              ? 'Mínimo 8 caracteres. Compártela con la persona por un canal privado.'
              : 'Déjala vacía para no cambiarla. Si la cambias, se cierran sus otras sesiones.')}
        </p>
      </div>

      {generalError && (
        <p className="admin-form-error" role="alert">
          {generalError}
        </p>
      )}

      <div className="admin-actions">
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Guardando…' : isNew ? 'Crear usuario' : 'Guardar cambios'}
        </button>
        <button type="button" className="btn admin-btn-secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default UserForm
