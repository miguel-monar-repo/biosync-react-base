import { createContext, useContext } from 'react'

// Permite mostrar avisos pequeños (toasts) desde cualquier componente:
//   const showToast = useToast()
//   showToast('check', 'Título', 'Texto')
export const ToastContext = createContext(() => {})

export function useToast() {
  return useContext(ToastContext)
}
