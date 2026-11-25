import type { z } from 'zod'
import type { lotSchema, movementSchema } from '../schemas/stockSchema'

export type Movement = z.infer<typeof movementSchema>
export type StockLot = z.infer<typeof lotSchema>
