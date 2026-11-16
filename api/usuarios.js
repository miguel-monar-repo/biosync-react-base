// Reglas de los usuarios del login. Las usan la API (panel de administración) y el script
// scripts/crear-usuario.js, así los dos validan igual.
import { ID_PLANES, PLANES_APP } from '../shared/planes.mjs'
import { reglas } from '../shared/validacionContacto.mjs'

export const ROLES = ['admin', 'usuario']
export const MIN_CONTRASENA = 8

// Los usuarios con rol "usuario" necesitan un plan; los admin ven todo y no lo usan.
// Recibe cómo queda el usuario después de crear o editar; devuelve el error o null.
export function errorDePlan({ rol, plan }) {
  return rol === 'usuario' && !plan ? 'Elige el plan al que accede este usuario.' : null
}

// Revisa los datos de un usuario. Con `nuevo: true` todos los campos son obligatorios
// (la contraseña también); al editar, solo se revisan los campos que llegan y la contraseña
// vacía significa "no cambiarla". Devuelve { datos limpios, errores }.
export function validarUsuario(cuerpo, { nuevo }) {
  const datos = {}
  const errores = {}
  const llega = (campo) => nuevo || cuerpo[campo] !== undefined

  if (llega('email')) {
    const { valor, error } = reglas.email(cuerpo.email)
    if (error) errores.email = error
    else datos.email = valor
  }

  if (llega('nombre')) {
    const nombre = typeof cuerpo.nombre === 'string' ? cuerpo.nombre.trim() : ''
    if (nombre.length > 60) errores.nombre = 'El nombre no puede pasar de 60 caracteres.'
    else if (nombre) datos.nombre = nombre
    else if (!nuevo) errores.nombre = 'Escribe un nombre.'
  }

  if (llega('rol')) {
    if (ROLES.includes(cuerpo.rol)) datos.rol = cuerpo.rol
    else errores.rol = `El rol debe ser: ${ROLES.join(' o ')}.`
  }

  // Plan: uno de los ids de shared/planes.mjs, o vacío (null) para "sin plan"
  if (llega('plan')) {
    const plan = cuerpo.plan ?? ''
    if (plan === '') datos.plan = null
    else if (ID_PLANES.includes(plan)) datos.plan = plan
    else errores.plan = `El plan debe ser: ${PLANES_APP.map((p) => p.nombre).join(', ')}.`
  }

  const contrasena = typeof cuerpo.contrasena === 'string' ? cuerpo.contrasena : ''
  if (nuevo || contrasena) {
    if (contrasena.length < MIN_CONTRASENA) {
      errores.contrasena = `La contraseña debe tener al menos ${MIN_CONTRASENA} caracteres.`
    } else {
      datos.contrasena = contrasena
    }
  }

  // Si se crea sin nombre, se usa la parte del correo antes de la @
  if (nuevo && !datos.nombre && datos.email) datos.nombre = datos.email.split('@')[0]

  // Al crear, el plan se revisa aquí; al editar, la API lo revisa con los datos que ya tenía
  if (nuevo && !errores.rol && !errores.plan) {
    const error = errorDePlan(datos)
    if (error) errores.plan = error
  }

  return { datos, errores }
}
