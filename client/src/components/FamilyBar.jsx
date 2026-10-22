import { useState } from 'react'
import { useFamily } from '../context/FamilyContext.js'
import { useToast } from '../context/ToastContext.js'
import Icon from './Icon.jsx'

// Barra de sincronización familiar. Reemplaza el prompt() del prototipo por un formulario.
function FamilyBar() {
  const showToast = useToast()
  const { isConfigured, isSynced, familyCode, joinFamily } = useFamily()
  const [formOpen, setFormOpen] = useState(false)
  const [code, setCode] = useState('')

  function openForm() {
    if (!isConfigured) {
      showToast(
        'alert',
        'Sincronización no configurada',
        'Configura las variables VITE_FIREBASE_* en client/.env (ver client/.env.example) para sincronizar entre dos teléfonos.',
      )
      return
    }
    setCode(familyCode || '')
    setFormOpen(true)
  }

  function handleSubmit(event) {
    event.preventDefault() // evita que el formulario recargue la página
    if (code.trim()) joinFamily(code)
    setFormOpen(false)
  }

  let status = 'Sincronización no configurada (ver client/.env.example)'
  if (isSynced) {
    status = (
      <>
        Sincronizado en vivo con el código <b>{familyCode}</b>
      </>
    )
  } else if (isConfigured) {
    status = 'Sin sincronizar con otro teléfono'
  }

  return (
    <div className="audio-bar">
      <Icon name="shield" />
      <span>{status}</span>

      {formOpen ? (
        <form className="family-form" onSubmit={handleSubmit}>
          <label htmlFor="familyCode">
            Código de familia (invéntalo e ingresa el mismo en el otro teléfono)
          </label>
          <input
            id="familyCode"
            type="text"
            placeholder="ej: garcia2024"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
          />
          <div className="btn-row">
            <button type="submit" className="pill-btn">
              Conectar
            </button>
            <button type="button" className="btn ghost" onClick={() => setFormOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="pill-btn" onClick={openForm}>
          Conectar con mi familia
        </button>
      )}
    </div>
  )
}

export default FamilyBar
