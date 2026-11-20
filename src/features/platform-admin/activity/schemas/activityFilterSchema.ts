import { z } from 'zod'
const date = z
  .string()
  .refine(
    (value) =>
      !value ||
      (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
        Number.isFinite(Date.parse(value)) &&
        new Date(value).toISOString().slice(0, 10) === value),
    'Ngày không hợp lệ.',
  )
export const activityFilterSchema = z
  .object({
    search: z.string().trim().max(255, 'Nhập tối đa 255 ký tự.'),
    action: z.string().trim().max(100, 'Nhập tối đa 100 ký tự.'),
    from: date,
    to: date,
    userId: z
      .string()
      .trim()
      .refine(
        (value) =>
          !value ||
          (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            value,
          ) &&
            value !== '00000000-0000-0000-0000-000000000000'),
        'Vui lòng nhập mã người dùng hợp lệ.',
      ),
  })
  .refine((value) => !value.from || !value.to || value.from <= value.to, {
    path: ['to'],
    message: 'Ngày kết thúc không được trước ngày bắt đầu.',
  })
export type ActivityFilterValues = z.infer<typeof activityFilterSchema>
