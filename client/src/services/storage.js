// Todo lo que se guarda en localStorage (y sessionStorage) pasa por aquí.
// Las claves son las mismas del prototipo para no perder datos guardados.

const FAMILY_CODE_KEY = 'biosync_family_code'
const STEPS_DAY_KEY = 'biosync_steps_day'
const STEPS_COUNT_KEY = 'biosync_steps_count'
const AUTH_TOKEN_KEY = 'biosync_auth_token'
const CHAT_HINT_KEY = 'biosync_chat_hint_dismissed'

// Invitación del chatbot: si ya se cerró (o se abrió el chat) en esta visita, no se vuelve a mostrar.
// Va en sessionStorage, así reaparece en la próxima visita. Si el navegador bloquea el
// almacenamiento, la invitación simplemente se muestra.
export function loadChatHintDismissed() {
  try {
    return sessionStorage.getItem(CHAT_HINT_KEY) === '1'
  } catch {
    return false
  }
}

export function saveChatHintDismissed() {
  try {
    sessionStorage.setItem(CHAT_HINT_KEY, '1')
  } catch {
    // Sin almacenamiento disponible no pasa nada: solo no se recuerda
  }
}

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
