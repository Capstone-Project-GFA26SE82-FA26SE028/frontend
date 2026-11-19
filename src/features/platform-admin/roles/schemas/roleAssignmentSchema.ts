import { z } from 'zod'

export const roleAssignmentSchema = z.object({
  role: z
    .string()
    .trim()
    .min(1, 'Vui lòng chọn vai trò.')
    .max(50, 'Vai trò không hợp lệ.'),
})
export type RoleAssignmentValues = z.infer<typeof roleAssignmentSchema>
