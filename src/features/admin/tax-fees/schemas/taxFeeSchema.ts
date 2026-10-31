import { z } from 'zod'
export const feeSchema = z
  .object({
    vat: z
      .number()
      .min(0, 'VAT không được âm.')
      .max(100, 'VAT tối đa 100%.')
      .refine(
        (v) => Math.abs(v * 10000 - Math.round(v * 10000)) < 0.000001,
        'Nhập tối đa 4 chữ số thập phân.',
      ),
    service: z
      .number()
      .min(0, 'Phí không được âm.')
      .max(100, 'Phí tối đa 100%.')
      .refine(
        (v) => Math.abs(v * 10000 - Math.round(v * 10000)) < 0.000001,
        'Nhập tối đa 4 chữ số thập phân.',
      ),
    serviceEnabled: z.boolean(),
    applyAt: z.enum(['now', 'scheduled']),
    effectiveAt: z.string(),
  })
  .superRefine((value, context) => {
    if (
      value.applyAt === 'scheduled' &&
      (!value.effectiveAt ||
        !Number.isFinite(Date.parse(value.effectiveAt)) ||
        Date.parse(value.effectiveAt) <= Date.now())
    ) {
      context.addIssue({
        code: 'custom',
        path: ['effectiveAt'],
        message: 'Chọn thời điểm trong tương lai.',
      })
    }
  })
export type Fees = z.infer<typeof feeSchema>
