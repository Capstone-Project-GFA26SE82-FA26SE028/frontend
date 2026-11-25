import type { z } from 'zod'
import type { areaSchema, tableSchema } from '../schemas/tableSchema'
export type Table = z.infer<typeof tableSchema>
export type Area = z.infer<typeof areaSchema>
export type TableFilters = { search: string; areaId: string; status: string }
