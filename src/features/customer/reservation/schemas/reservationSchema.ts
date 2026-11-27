import { z } from 'zod'

export const reservationSchema = z
  .object({
    restaurantId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, 'Vui lòng chọn nhà hàng.'),
    name: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập tên của bạn.')
      .max(80, 'Tên không quá 80 ký tự.'),
    phone: z
      .string()
      .trim()
      .transform((value) => value.replace(/\s/g, ''))
      .pipe(
        z
          .string()
          .regex(
            /^(0\d{9}|\+84\d{9})$/,
            'Nhập số điện thoại 10 chữ số bắt đầu bằng 0 hoặc +84 và 9 chữ số.',
          ),
      ),
    date: z.iso.date('Vui lòng chọn ngày đến hợp lệ.'),
    time: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Vui lòng chọn giờ đến hợp lệ.'),
    guests: z
      .number({ error: 'Vui lòng chọn số khách.' })
      .int('Số khách phải là số nguyên.')
      .min(1, 'Cần ít nhất 1 khách.')
      .max(12, 'Tối đa 12 khách cho một yêu cầu.'),
  })
  .superRefine((values, context) => {
    if (
      !z.iso.date().safeParse(values.date).success ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.time)
    )
      return
    const distance =
      new Date(`${values.date}T${values.time}:00+07:00`).getTime() - Date.now()
    if (!Number.isFinite(distance) || distance < 30 * 60 * 1000) {
      context.addIssue({
        code: 'custom',
        path: ['time'],
        message: 'Vui lòng đặt trước ít nhất 30 phút.',
      })
    } else if (distance > 30 * 24 * 60 * 60 * 1000) {
      context.addIssue({
        code: 'custom',
        path: ['date'],
        message: 'Chỉ nhận đặt bàn trước tối đa 30 ngày.',
      })
    }
  })

export type ReservationFormValues = z.infer<typeof reservationSchema>
