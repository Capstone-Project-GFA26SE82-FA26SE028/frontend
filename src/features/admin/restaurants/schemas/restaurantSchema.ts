import { z } from 'zod'
const time = z
  .string()
  .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, 'Use HH:mm format.')
export const restaurantSchema = z
  .object({
    restaurantName: z
      .string()
      .trim()
      .min(1, 'Enter the restaurant name.')
      .max(255),
    address: z.string().trim().min(1, 'Enter the address.').max(500),
    hotline: z.string().trim().min(1, 'Enter the hotline.').max(20),
    taxCode: z.string().trim().max(50),
    logoUrl: z
      .string()
      .trim()
      .max(2048)
      .refine(
        (v) => !v || (z.url().safeParse(v).success && /^https?:\/\//i.test(v)),
        'Enter an HTTP or HTTPS image URL.',
      ),
    timeZone: z.string().trim().min(1, 'Enter a time zone.').max(100),
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
            message: 'Closing time must be after opening time on the same day.',
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
          message: 'This day is already listed.',
        })
      days.add(h.dayOfWeek)
    })
  })
export type RestaurantValues = z.infer<typeof restaurantSchema>
