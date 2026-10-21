import { z } from 'zod'
export const authUserSchema = z.object({
  userId: z.string().min(1),
  roleId: z.string().min(1),
  userName: z.string(),
  email: z.string(),
  fullName: z.string().nullable().optional(),
  isActive: z.boolean(),
})
export const authSessionSchema = z.object({
  user: authUserSchema,
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  sessionId: z.string().min(1),
  expiresAt: z.string().datetime({ offset: true }),
  sessionExpiresAt: z.string().datetime({ offset: true }),
})
export type AuthSession = z.infer<typeof authSessionSchema>
export type LoginInput = { email: string; password: string }
