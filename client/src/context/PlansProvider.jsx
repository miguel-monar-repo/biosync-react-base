import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchPlans } from '../services/plans.js'
import { PlansContext } from './PlansContext.js'

// Trae los planes de la API una sola vez, al abrir la web, y los comparte con todas las páginas
export function PlansProvider({ children }) {
  const [plans, setPlans] = useState([])
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    fetchPlans()
      .then((list) => {
        if (!active) return
        setPlans(list)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [attempt])

  const retry = useCallback(() => {
    setStatus('loading')
    setAttempt((n) => n + 1)
  }, [])

  const value = useMemo(() => ({ plans, status, retry }), [plans, status, retry])

  return <PlansContext value={value}>{children}</PlansContext>
}
