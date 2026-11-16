// Reglas del formulario de compra de un plan, compartidas por el navegador y la API.
// Reutiliza las reglas de correo, celular y consentimiento del formulario de contacto.
import { ID_PLANES } from './planes.mjs'
import { reglas } from './validacionContacto.mjs'

export const reglasCompra = {
  plan(valor) {
    const ok = ID_PLANES.includes(valor)
    return { valor: ok ? valor : null, error: ok ? null : 'Elige un plan.' }
  },
  email: reglas.email,
  celular: reglas.celular,
  consentimiento: reglas.consentimiento,
}

export function validarCompra(datos) {
  const limpios = {}
  const errores = {}
  for (const campo of Object.keys(reglasCompra)) {
    const { valor, error } = reglasCompra[campo](datos ? datos[campo] : undefined)
    limpios[campo] = valor
    if (error) errores[campo] = error
  }
  return { datos: limpios, errores, valido: Object.keys(errores).length === 0 }
}
