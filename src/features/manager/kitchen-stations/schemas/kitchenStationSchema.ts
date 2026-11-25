import { z } from 'zod'

export const kitchenStationSchema = z.object({
  kitchenStationId: z.string(),
  kitchenStationCode: z.string(),
  kitchenStationName: z.string(),
  isActive: z.boolean(),
})
export const stationWriteSchema = z.object({
  kitchenStationCode: z
    .string()
    .trim()
    .toUpperCase()
    .min(1)
    .max(50)
    .regex(/^[A-Z0-9_-]+$/, 'Mã chỉ gồm chữ ASCII, số, _ và -.'),
  kitchenStationName: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .refine(
      (name) =>
        !Array.from(name).some(
          (char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127,
        ),
      'Tên chứa ký tự không hợp lệ.',
    ),
})
export const stationItemSchema = z.object({
  itemId: z.string(),
  itemCode: z.string(),
  itemName: z.string(),
  kitchenStationId: z.string().nullable(),
  version: z.string().min(1),
})
