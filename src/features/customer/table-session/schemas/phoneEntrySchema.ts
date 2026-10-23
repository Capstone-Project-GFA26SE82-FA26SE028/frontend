import { z } from 'zod'
export const phoneEntrySchema = z.object({
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\s/g, ''))
    .pipe(
      z
        .string()
        .regex(
          /^(\d{3}|0\d{9})$/,
          'Enter a 3-digit code or a 10-digit phone number starting with 0.',
        ),
    ),
})
export type PhoneEntryValues = z.infer<typeof phoneEntrySchema>
