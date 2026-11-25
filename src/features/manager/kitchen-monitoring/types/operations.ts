import type { z } from 'zod'
import type {
  kitchenTaskSchema,
  tableSchema,
} from '../schemas/operationsSchema'
export type KitchenTask = z.infer<typeof kitchenTaskSchema>
export type MonitoredTable = z.infer<typeof tableSchema>
