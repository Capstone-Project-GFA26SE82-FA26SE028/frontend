import { z } from 'zod'

export const loyaltyPhoneSchema = z
  .string()
  .transform((phone) => phone.trim().replace(/[ .()-]/g, '').replace(/^\+?84/, '0'))
  .refine((phone) => /^0\d{9}$/.test(phone), 'Nhập số điện thoại đầy đủ.')
