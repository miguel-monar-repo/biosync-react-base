import { createContext, useContext } from 'react'

// Banner grande de alerta ("¿Estás bien?") que sale desde abajo:
//   const showBanner = useAlertBanner()
//   showBanner('Título', 'Texto', { confirmable: true, ms: 15000, onConfirm, onEscalate })
export const AlertBannerContext = createContext(() => {})

export function useAlertBanner() {
  return useContext(AlertBannerContext)
}
