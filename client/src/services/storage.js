// Todo lo que se guarda en localStorage pasa por aquí.
// Las claves son las mismas del prototipo para no perder datos guardados.

const FAMILY_CODE_KEY = 'biosync_family_code'
const STEPS_DAY_KEY = 'biosync_steps_day'
const STEPS_COUNT_KEY = 'biosync_steps_count'
const AUTH_TOKEN_KEY = 'biosync_auth_token'

// Token de la sesión del login (no vence: se borra al cerrar sesión)
export function loadAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function saveAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export function loadFamilyCode() {
  return localStorage.getItem(FAMILY_CODE_KEY)
}

export function saveFamilyCode(code) {
  localStorage.setItem(FAMILY_CODE_KEY, code)
}

// Pasos guardados de hoy. Si lo guardado es de otro día, empieza en 0.
export function loadTodaySteps() {
  if (localStorage.getItem(STEPS_DAY_KEY) !== todayKey()) return 0
  const saved = localStorage.getItem(STEPS_COUNT_KEY)
  return saved !== null ? parseInt(saved, 10) : 0
}

export function saveTodaySteps(steps) {
  localStorage.setItem(STEPS_DAY_KEY, todayKey())
  localStorage.setItem(STEPS_COUNT_KEY, String(steps))
}

// true si los pasos guardados son de un día anterior
export function isNewDay() {
  return localStorage.getItem(STEPS_DAY_KEY) !== todayKey()
}
