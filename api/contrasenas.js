// Contraseñas: nunca se guardan tal cual, sino como un hash con scrypt (incluido en Node).
// Formato guardado en la base: "scrypt:<sal en hex>:<hash en hex>".
// Lo usan la API (para el login) y el script que crea usuarios.
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)
const LARGO_HASH = 64

export async function hashContrasena(contrasena) {
  const sal = randomBytes(16)
  const hash = await scryptAsync(contrasena, sal, LARGO_HASH)
  return `scrypt:${sal.toString('hex')}:${hash.toString('hex')}`
}

export async function verificarContrasena(contrasena, guardada) {
  const [tipo, salHex, hashHex] = String(guardada).split(':')
  if (tipo !== 'scrypt' || !salHex || !hashHex) return false
  const hash = await scryptAsync(contrasena, Buffer.from(salHex, 'hex'), LARGO_HASH)
  // timingSafeEqual compara sin revelar, por el tiempo de respuesta, cuántos caracteres coinciden
  return timingSafeEqual(hash, Buffer.from(hashHex, 'hex'))
}

// Contraseña aleatoria de 16 caracteres (para el script de usuarios)
export function generarContrasena() {
  return randomBytes(12).toString('base64url')
}
