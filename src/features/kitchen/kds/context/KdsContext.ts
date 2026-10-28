import { createContext } from 'react'
import type { KdsState, KdsCommand, Ticket, Station } from '../types'

export type KdsContextValue = {
  state: KdsState
  tickets: Ticket[]
  run: (command: KdsCommand) => Promise<boolean>
  pending: boolean
  loading: boolean
  errors: string[]
  refresh: () => void
  dismissFeedback: () => void
  stations: Station[]
  stationId: string
  setStationId: (id: string) => void
}
export const KdsContext = createContext<KdsContextValue | null>(null)
