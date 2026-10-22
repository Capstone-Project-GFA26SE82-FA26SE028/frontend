import { z } from 'zod'

export const roleAssignmentSchema = z.object({
  role: z.string().trim().min(1, 'Select a role.').max(50, 'Invalid role.'),
})
export type RoleAssignmentValues = z.infer<typeof roleAssignmentSchema>
