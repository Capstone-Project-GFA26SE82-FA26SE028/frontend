import { z } from 'zod'
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email or username.')
    .max(255, 'Use no more than 255 characters.'),
  password: z
    .string()
    .min(1, 'Please enter your password.')
    .refine(
      (value) => new TextEncoder().encode(value).length <= 72,
      'Password must not exceed 72 bytes.',
    ),
})
