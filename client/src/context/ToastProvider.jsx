import { useCallback, useRef, useState } from 'react'
import ToastList from '../components/ToastList.jsx'
import { ToastContext } from './ToastContext.js'

const TOAST_MS = 4200
const FADE_MS = 300

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const showToast = useCallback((icon, title, body) => {
    const id = nextId.current++
    setToasts((list) => [...list, { id, icon, title, body, leaving: false }])

    // Después de 4.2 s se desvanece y luego se quita de la lista
    setTimeout(() => {
      setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
      setTimeout(() => {
        setToasts((list) => list.filter((t) => t.id !== id))
      }, FADE_MS)
    }, TOAST_MS)
  }, [])

  return (
    <ToastContext value={showToast}>
      {children}
      <ToastList toasts={toasts} />
    </ToastContext>
  )
}
