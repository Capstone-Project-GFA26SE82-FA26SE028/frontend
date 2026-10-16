import { z } from 'zod'
export const tableSchema = z.object({
  id: z.string(),
  code: z.string().trim().min(1, 'Nhập mã bàn.').max(20),
  name: z.string().trim().min(1, 'Nhập tên bàn.').max(80),
  capacity: z
    .number()
    .int('Sức chứa là số nguyên.')
    .min(1, 'Ít nhất 1 khách.')
    .max(100),
  areaId: z.string(),
  note: z.string().max(300),
  active: z.boolean(),
  busy: z.boolean(),
  history: z.boolean(),
  token: z.string().optional(),
})
export type RestaurantTable = z.infer<typeof tableSchema>
