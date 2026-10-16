import { z } from 'zod'

export const phoneEntrySchema = z.object({
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s/g, ''))
    .pipe(
      z
        .string()
        .regex(
          /^(0\d{9}|\+84\d{9})$/,
          'Vui lòng nhập số điện thoại hợp lệ, ví dụ 090 123 4567.',
        ),
    ),
})

export type PhoneEntryValues = z.infer<typeof phoneEntrySchema>
