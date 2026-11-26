import { z } from 'zod'

export const cashHandoverSchema = z
  .string()
  .regex(/^\d+$/, 'Nhập số tiền nguyên từ 0 đồng trở lên.')
  .transform(Number)
  .refine(
    Number.isSafeInteger,
    `Nhập tối đa ${Number.MAX_SAFE_INTEGER.toLocaleString('vi-VN')} đồng.`,
  )
