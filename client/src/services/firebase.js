// Conexión con Firebase (Firestore) para sincronizar a la familia entre teléfonos.
// Las claves NO van en el código: se leen de client/.env (ver client/.env.example).
// Si no están configuradas, `db` es null y la app funciona sin sincronizar.
import { initializeApp } from 'firebase/app'
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

function createDb() {
  if (!firebaseConfig.apiKey) return null
  try {
    return getFirestore(initializeApp(firebaseConfig))
  } catch (err) {
    console.error('Firebase no se pudo inicializar', err)
    return null
  }
}

export const db = createDb()

// Identifica a este teléfono, para ignorar los eventos que él mismo envía
export const deviceId = Math.random().toString(36).slice(2)
// Solo se muestran los eventos que llegan después de abrir la app
export const sessionStartTs = Date.now()

// Estructura en Firestore: families/{código}/messages | events | locations
function familyCollection(code, name) {
  return collection(db, 'families', code, name)
}

export function addFamilyMessage(code, entry) {
  return addDoc(familyCollection(code, 'messages'), entry)
}

export function addFamilyEvent(code, type, message, severity = 'warn') {
  return addDoc(familyCollection(code, 'events'), {
    type,
    message,
    ts: Date.now(),
    origin: deviceId,
    severity,
  })
}

export function saveFamilyLocation(code, kind, lat, lng) {
  return setDoc(doc(db, 'families', code, 'locations', kind), { lat, lng, updatedAt: Date.now() })
}

// Las funciones subscribe... devuelven otra función para cancelar la suscripción

export function subscribeMessages(code, onChange) {
  const q = query(familyCollection(code, 'messages'), orderBy('ts', 'asc'))
  return onSnapshot(q, (snap) => onChange(snap.docs.map((d) => d.data())))
}

export function subscribeNewEvents(code, onEvent) {
  const q = query(familyCollection(code, 'events'), orderBy('ts', 'asc'))
  return onSnapshot(q, (snap) => {
    snap.docChanges().forEach((change) => {
      if (change.type !== 'added') return
      const ev = change.doc.data()
      if (ev.origin === deviceId) return
      if (ev.ts < sessionStartTs) return
      onEvent(ev)
    })
  })
}

export function subscribeLocation(code, kind, onChange) {
  return onSnapshot(doc(db, 'families', code, 'locations', kind), (snapshot) => {
    if (snapshot.exists()) onChange(snapshot.data())
  })
}
