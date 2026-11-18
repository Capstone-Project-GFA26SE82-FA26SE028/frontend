import { z } from 'zod'

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập họ và tên.')
      .max(255, 'Họ và tên không quá 255 ký tự.'),
    email: z
      .string()
      .trim()
      .email('Vui lòng nhập email hợp lệ.')
      .max(255, 'Email không quá 255 ký tự.'),
    phoneNumber: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || /^0\d{9}$/.test(value),
        'Nhập số điện thoại gồm 10 chữ số bắt đầu bằng 0.',
      ),
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
      .refine(
        (value) => value.trim().length > 0,
        'Mật khẩu không được chỉ chứa khoảng trắng.',
      )
      .refine(
        (value) => new TextEncoder().encode(value).length <= 72,
        'Mật khẩu quá dài. Vui lòng nhập ngắn hơn.',
      ),
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu nhập lại không khớp.',
  })
