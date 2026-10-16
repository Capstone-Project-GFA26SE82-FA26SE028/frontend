import { z } from 'zod'
import { roles } from './types'
const name = z
  .string()
  .trim()
  .min(2, 'Nhập ít nhất 2 ký tự.')
  .max(100, 'Không quá 100 ký tự.')
const phone = z
  .string()
  .trim()
  .regex(/^0\d{9}$/, 'Nhập số điện thoại gồm 10 chữ số, bắt đầu bằng 0.')
const email = z
  .string()
  .trim()
  .toLowerCase()
  .email('Email chưa đúng định dạng.')
export const userFormSchema = z
  .object({
    name,
    email,
    phone,
    role: z.enum(roles),
    restaurantId: z.string(),
  })
  .refine((v) => v.role === 'Admin' || Boolean(v.restaurantId), {
    message: 'Chọn nhà hàng phụ trách.',
    path: ['restaurantId'],
  })
export type UserFormValues = z.infer<typeof userFormSchema>
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
