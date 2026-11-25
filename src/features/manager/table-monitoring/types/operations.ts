import type { z } from 'zod'
import type {
  activitySchema,
  kitchenTaskSchema,
  tableSchema,
} from '../schemas/operationsSchema'

export type MonitoredTable = z.infer<typeof tableSchema>
export type KitchenTask = z.infer<typeof kitchenTaskSchema>
export type StaffActivity = z.infer<typeof activitySchema>
