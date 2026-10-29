import { z } from 'zod'
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập email hoặc tên đăng nhập.')
    .max(255, 'Vui lòng nhập tối đa 255 ký tự.'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu.')
    .refine(
      (value) => new TextEncoder().encode(value).length <= 72,
      'Mật khẩu không được vượt quá 72 byte.',
    ),
})
