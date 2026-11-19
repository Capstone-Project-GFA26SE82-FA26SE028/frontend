import { z } from 'zod'
const time = z
  .string()
  .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, 'Sử dụng định dạng HH:mm.')
export const restaurantSchema = z
  .object({
    restaurantName: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập tên nhà hàng.')
      .max(255),
    address: z.string().trim().min(1, 'Vui lòng nhập địa chỉ.').max(500),
    hotline: z.string().trim().min(1, 'Vui lòng nhập số điện thoại.').max(20),
    taxCode: z.string().trim().max(50),
    logoUrl: z
      .string()
      .trim()
      .max(2048)
      .refine(
        (v) => !v || (z.url().safeParse(v).success && /^https?:\/\//i.test(v)),
        'Nhập đường dẫn ảnh HTTP hoặc HTTPS hợp lệ.',
      ),
    timeZone: z.string().trim().min(1, 'Vui lòng nhập múi giờ.').max(100),
    openingHours: z
      .array(
        z
          .object({
            dayOfWeek: z.number().int().min(0).max(6),
            openAt: time,
            closeAt: time,
          })
          .refine((v) => v.openAt < v.closeAt, {
            path: ['closeAt'],
            message: 'Giờ đóng cửa phải sau giờ mở cửa trong cùng ngày.',
          }),
      )
      .max(7),
  })
  .superRefine((v, ctx) => {
    const days = new Set<number>()
    v.openingHours.forEach((h, i) => {
      if (days.has(h.dayOfWeek))
        ctx.addIssue({
          code: 'custom',
          path: ['openingHours', i, 'dayOfWeek'],
          message: 'Ngày này đã được chọn.',
        })
      days.add(h.dayOfWeek)
    })
  })
export type RestaurantValues = z.infer<typeof restaurantSchema>
