// Reglas del formulario de contacto, compartidas por el navegador (client/) y el servidor (api/).
// Cada regla recibe el valor tal como llega y devuelve { valor limpio, error }.
// Es .mjs (y no .js) porque shared/ no tiene package.json: así Node sabe que usa import/export.
// Con .js, Vercel lo trata como CommonJS y la API falla al arrancar.
export const PLANES = ['Niño', 'Adulto mayor', 'Deportivo', 'Familiar', 'Aún no sé']

const texto = (valor) => (typeof valor === 'string' ? valor.normalize('NFC') : '')

export const reglas = {
  nombre(valor) {
    const limpio = texto(valor).trim()
    const ok = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{2,60}$/.test(limpio)
    return { valor: limpio, error: ok ? null : 'Escribe tu nombre (mínimo 2 letras).' }
  },

  email(valor) {
    const limpio = texto(valor).trim().toLowerCase()
    const ok = limpio.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(limpio)
    return {
      valor: limpio,
      error: ok ? null : 'Escribe un correo válido, por ejemplo nombre@correo.com.',
    }
  },

  celular(valor) {
    // Celular de Ecuador: 10 dígitos. Se permiten espacios al escribir, pero se guardan solo los dígitos
    const limpio = texto(valor).replace(/\s/g, '')
    const ok = /^\d{10}$/.test(limpio)
    return { valor: limpio, error: ok ? null : 'El celular debe tener 10 dígitos.' }
  },

  planInteres(valor) {
    const limpio = texto(valor).trim()
    if (limpio === '') return { valor: null, error: null }
    return { valor: limpio, error: PLANES.includes(limpio) ? null : 'Selecciona un plan de la lista.' }
  },

  mensaje(valor) {
    const limpio = texto(valor).trim()
    let error = null
    if (limpio.length < 10) error = 'Cuéntanos un poco más (mínimo 10 caracteres).'
    else if (limpio.length > 1000) error = 'El mensaje no puede pasar de 1000 caracteres.'
    return { valor: limpio, error }
  },

  consentimiento(valor) {
    const ok = valor === true
    return { valor: ok, error: ok ? null : 'Necesitamos tu autorización para poder contactarte.' }
  },
}

// Recomendaciones: se muestran en el formulario pero NO impiden enviarlo (el servidor no las revisa).
// Cada una recibe el valor y devuelve el texto del aviso, o null si no hay nada que recomendar.
export const avisos = {
  celular(valor) {
    const limpio = texto(valor).replace(/\s/g, '')
    if (limpio === '' || limpio.startsWith('0')) return null
    return 'El celular debería empezar con 0 (por ejemplo 099 123 4567).'
  },
}

export function validarContacto(datos) {
  const limpios = {}
  const errores = {}
  for (const campo of Object.keys(reglas)) {
    const { valor, error } = reglas[campo](datos ? datos[campo] : undefined)
    limpios[campo] = valor
    if (error) errores[campo] = error
  }
  return { datos: limpios, errores, valido: Object.keys(errores).length === 0 }
}
