import type { z } from 'zod'
import type {
  kitchenStationSchema,
  stationItemSchema,
  stationWriteSchema,
} from '../schemas/kitchenStationSchema'
export type KitchenStation = z.infer<typeof kitchenStationSchema>
export type StationItem = z.infer<typeof stationItemSchema>
export type StationWrite = z.infer<typeof stationWriteSchema>
export type StationAction =
  | { kind: 'save'; id?: string; body: StationWrite }
  | { kind: 'status'; id: string; isActive: boolean }
  | { kind: 'assign'; item: StationItem; stationId: string | null }
