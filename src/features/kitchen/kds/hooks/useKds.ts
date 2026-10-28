import { useContext } from 'react'
import { KdsContext } from '../context/KdsContext'

export function useKds() {
  const context = useContext(KdsContext)
  if (!context) throw new Error('KdsProvider is required.')
  return context
}
