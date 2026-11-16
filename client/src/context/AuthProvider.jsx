import { useCallback, useEffect, useMemo, useState } from 'react'
import * as authApi from '../services/auth.js'
import { clearAuthToken, loadAuthToken, saveAuthToken } from '../services/storage.js'
import { AuthContext } from './AuthContext.js'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => loadAuthToken())
  const [user, setUser] = useState(null)
  // Si hay un token guardado hay que revisarlo con la API; si no, no hay sesión
  const [status, setStatus] = useState(() => (loadAuthToken() ? 'checking' : 'signed-out'))
  const [attempt, setAttempt] = useState(0)

  // Al abrir la app con un token guardado, se pregunta a la API si sigue siendo válido
  useEffect(() => {
    if (!token || user) return
    let active = true

    authApi
      .fetchSession(token)
      .then((sessionUser) => {
        if (!active) return
        setUser(sessionUser)
        setStatus('signed-in')
      })
      .catch((error) => {
        if (!active) return
        if (error.status === 401) {
          // El token ya no sirve (por ejemplo, se cerró la sesión en otro lado)
          clearAuthToken()
          setToken(null)
          setStatus('signed-out')
        } else {
          // Sin conexión o error del servidor: no se borra el token, se puede reintentar
          setStatus('error')
        }
      })

    return () => {
      active = false
    }
  }, [token, user, attempt])

  const login = useCallback(async (email, password) => {
    const result = await authApi.login(email, password)
    saveAuthToken(result.token)
    setToken(result.token)
    setUser(result.usuario)
    setStatus('signed-in')
  }, [])

  const logout = useCallback(async () => {
    // Aunque la API no responda, la sesión se cierra en este teléfono
    await authApi.logout(token).catch(() => {})
    clearAuthToken()
    setToken(null)
    setUser(null)
    setStatus('signed-out')
  }, [token])

  const retry = useCallback(() => {
    setStatus('checking')
    setAttempt((n) => n + 1)
  }, [])

  // Cuando un admin edita sus propios datos en el panel, se actualizan aquí sin volver a ingresar
  const updateUser = useCallback((changes) => {
    setUser((current) => (current ? { ...current, ...changes } : current))
  }, [])

  const value = useMemo(
    () => ({ status, user, login, logout, retry, updateUser }),
    [status, user, login, logout, retry, updateUser],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
