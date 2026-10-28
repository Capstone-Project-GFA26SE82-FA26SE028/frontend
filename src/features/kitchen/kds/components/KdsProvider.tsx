import type { PropsWithChildren } from 'react'
import { KdsContext } from '../context/KdsContext'
import { useKdsData } from '../hooks/useKdsData'

export function KdsProvider({ children }: PropsWithChildren) {
  const value = useKdsData()
  return <KdsContext.Provider value={value}>{children}</KdsContext.Provider>
}
