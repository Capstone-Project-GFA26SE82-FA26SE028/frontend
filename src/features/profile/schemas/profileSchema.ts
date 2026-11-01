import { z } from 'zod'

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập họ và tên.')
    .max(255, 'Họ và tên tối đa 255 ký tự.'),
  phoneNumber: z
    .string()
    .trim()
    .refine(
      (value) => !value || /^0\d{9}$/.test(value),
      'Nhập số điện thoại gồm 10 chữ số bắt đầu bằng 0.',
    ),
  avatarUrl: z
    .string()
    .trim()
    .max(2048, 'Đường dẫn ảnh tối đa 2048 ký tự.')
    .refine((value) => {
      if (!value) return true
      try {
        return ['http:', 'https:'].includes(new URL(value).protocol)
      } catch {
        return false
      }
    }, 'Nhập đường dẫn ảnh HTTP hoặc HTTPS hợp lệ.'),
})

const maxPasswordBytes = (value: string) =>
  new TextEncoder().encode(value).length <= 72
export const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Vui lòng nhập mật khẩu hiện tại.')
      .refine(maxPasswordBytes, 'Mật khẩu quá dài. Vui lòng nhập ngắn hơn.'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
      .refine(
        (value) => value.trim().length > 0,
        'Mật khẩu không được chỉ chứa khoảng trắng.',
      )
      .refine(maxPasswordBytes, 'Mật khẩu quá dài. Vui lòng nhập ngắn hơn.'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới.'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu xác nhận không khớp.',
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ['newPassword'],
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại.',
  })
