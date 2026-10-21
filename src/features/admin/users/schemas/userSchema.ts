import { z } from 'zod'
import { roles } from '../types'

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
      .min(1, 'Enter a username.')
      .max(100, 'Use no more than 100 characters.')
      .regex(/^\S+$/, 'Username must not contain spaces.'),
    name: z
      .string()
      .trim()
      .min(1, 'Enter a full name.')
      .max(255, 'Use no more than 255 characters.'),
    email: z
      .string()
      .trim()
      .email('Enter a valid email address.')
      .max(255, 'Use no more than 255 characters.'),
    phone: z.string().trim().refine(
      value => value === '' || /^0\d{9}$/.test(value),
      'Enter a 10-digit phone number starting with 0.',
    ),
    avatarUrl: z.string().trim().max(2048, 'Use no more than 2048 characters.')
      .refine(value => {
        if (!value) return true
        try { return ['http:', 'https:'].includes(new URL(value).protocol) }
        catch { return false }
      }, 'Enter a valid HTTP or HTTPS image URL.'),
    role: z.string().min(1, 'Select a role.'),
    password: editing
      ? z.string()
      : z
          .string()
          .min(8, 'Password must contain at least 8 characters.')
          .refine(
            (value) => value.trim().length > 0,
            'Password must not consist only of spaces.',
          )
          .refine(
            (value) => new TextEncoder().encode(value).length <= 72,
            'Password must not exceed 72 UTF-8 bytes.',
          ),
  })
export type AccountFormValues = z.infer<ReturnType<typeof accountFormSchema>>
