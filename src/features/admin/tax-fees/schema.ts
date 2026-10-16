import { z } from 'zod'
export const feeSchema = z.object({
  vat: z.number().min(0).max(100, 'VAT tối đa 100%.'),
  service: z.number().min(0).max(100, 'Phí tối đa 100%.'),
  serviceEnabled: z.boolean(),
  effectiveAt: z
    .string()
    .min(1, 'Chọn thời điểm hiệu lực.')
    .refine(
      (v) => !Number.isNaN(new Date(v).getTime()),
      'Thời điểm không hợp lệ.',
    ),
})
export type Fees = z.infer<typeof feeSchema>

export type FeeVersion = Fees & { id: string }
