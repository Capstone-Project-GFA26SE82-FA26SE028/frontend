import { z } from 'zod'
export const profileSchema = z
  .object({
    name: z.string().trim().min(2, 'Nhập tên nhà hàng.').max(100),
    taxCode: z
      .string()
      .trim()
      .refine(
        (v) => !v || /^([0-9]{10}|[0-9]{13}|[0-9]{10}-[0-9]{3})$/.test(v),
        'Mã số thuế không hợp lệ.',
      ),
    address: z.string().trim().min(5, 'Nhập địa chỉ.').max(200),
    phone: z
      .string()
      .trim()
      .regex(/^0[0-9]{9,10}$/, 'Nhập số điện thoại hợp lệ.'),
    email: z
      .string()
      .trim()
      .refine(
        (v) => !v || z.email().safeParse(v).success,
        'Email không hợp lệ.',
      ),
    opening: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/),
    closing: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/),
    logo: z.string(),
  })
  .refine((v) => v.opening < v.closing, {
    path: ['closing'],
    message: 'Giờ đóng phải sau giờ mở (khung giờ trong ngày).',
  })
export type Profile = z.infer<typeof profileSchema>
