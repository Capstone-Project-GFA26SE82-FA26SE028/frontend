import { z } from 'zod'
export const areaSchema = z.object({
  id: z.string(),
  code: z.string().trim().min(1, 'Nhập mã khu vực.').max(20),
  name: z.string().trim().min(1, 'Nhập tên khu vực.').max(80),
  description: z.string().max(300),
  active: z.boolean(),
})
export type Area = z.infer<typeof areaSchema>
