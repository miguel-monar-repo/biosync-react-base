import { createContext, useContext } from 'react'

// Sesión del login, disponible en cualquier componente:
//   const { status, user, login, logout, retry } = useAuth()
// status: 'checking' (revisando el token guardado), 'signed-in', 'signed-out' o 'error'
export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}
