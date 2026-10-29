import { z } from 'zod'
import { roles } from '../types/types'

const storedRestaurant = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
})
const storedUser = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  role: z.enum(roles),
  restaurantId: z.string(),
  active: z.boolean(),
  created: z.string(),
})
export const usersStorageSchema = z.object({
  restaurants: z.array(storedRestaurant),
  users: z.array(storedUser),
})

export const accountFormSchema = (editing: boolean) =>
  z.object({
    userName: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập tên đăng nhập.')
      .max(100, 'Vui lòng nhập tối đa 100 ký tự.')
      .regex(/^\S+$/, 'Tên đăng nhập không được chứa khoảng trắng.'),
    name: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập họ và tên.')
      .max(255, 'Vui lòng nhập tối đa 255 ký tự.'),
    email: z
      .string()
      .trim()
      .email('Vui lòng nhập email hợp lệ.')
      .max(255, 'Vui lòng nhập tối đa 255 ký tự.'),
    phone: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || /^0\d{9}$/.test(value),
        'Nhập số điện thoại gồm 10 chữ số bắt đầu bằng 0.',
      ),
    avatarUrl: z
      .string()
      .trim()
      .max(2048, 'Vui lòng nhập tối đa 2048 ký tự.')
      .refine((value) => {
        if (!value) return true
        try {
          return ['http:', 'https:'].includes(new URL(value).protocol)
        } catch {
          return false
        }
      }, 'Nhập đường dẫn ảnh HTTP hoặc HTTPS hợp lệ.'),
    role: z.string().min(1, 'Vui lòng chọn vai trò.'),
    password: editing
      ? z.string()
      : z
          .string()
          .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
          .refine(
            (value) => value.trim().length > 0,
            'Mật khẩu không được chỉ chứa khoảng trắng.',
          )
          .refine(
            (value) => new TextEncoder().encode(value).length <= 72,
            'Mật khẩu không được vượt quá 72 byte UTF-8.',
          ),
  })
export type AccountFormValues = z.infer<ReturnType<typeof accountFormSchema>>
