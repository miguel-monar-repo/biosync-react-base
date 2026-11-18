import { createContext, useContext } from 'react'

// Planes de BioSync (vienen de MongoDB a través de la API), disponibles en cualquier componente:
//   const { plans, status, retry } = usePlans()
// status: 'loading', 'ready' o 'error'
export const PlansContext = createContext({ plans: [], status: 'loading', retry: () => {} })

export function usePlans() {
  return useContext(PlansContext)
}
