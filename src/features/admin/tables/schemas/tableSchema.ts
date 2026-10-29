import { z } from 'zod'
const position = z
  .number()
  .min(-99999999.99)
  .max(99999999.99)
  .refine(
    (v) => Math.abs(v * 100 - Math.round(v * 100)) < 0.00001,
    'Chỉ nhập tối đa 2 chữ số thập phân.',
  )
  .nullable()
export const tableSchema = z.object({
  areaId: z.uuid('Vui lòng chọn khu vực.'),
  tableCode: z.string().trim().min(1, 'Vui lòng nhập mã bàn.').max(50),
  capacity: z.number().int().min(1).max(2147483647),
  positionX: position,
  positionY: position,
  version: z.string(),
})
export type TableValues = z.infer<typeof tableSchema>
