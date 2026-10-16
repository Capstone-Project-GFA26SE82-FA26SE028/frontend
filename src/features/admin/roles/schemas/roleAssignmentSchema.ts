import { z } from 'zod'
import { roles } from '../../users/types'

export const roleAssignmentSchema = z
  .object({
    role: z.enum(roles),
    restaurantId: z.string(),
    reason: z
      .string()
      .trim()
      .min(10, 'Nhập lý do ít nhất 10 ký tự.')
      .max(500, 'Không quá 500 ký tự.'),
  })
  .refine((v) => v.role === 'Admin' || Boolean(v.restaurantId), {
    path: ['restaurantId'],
    message: 'Chọn nhà hàng được phân công.',
  })
export type RoleAssignmentValues = z.infer<typeof roleAssignmentSchema>
