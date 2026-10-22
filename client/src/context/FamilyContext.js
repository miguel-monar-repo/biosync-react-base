import { createContext, useContext } from 'react'

// Sincronización con la familia por Firebase:
//   const { isConfigured, isSynced, familyCode, messages, joinFamily, sendEvent } = useFamily()
export const FamilyContext = createContext(null)

export function useFamily() {
  return useContext(FamilyContext)
}
