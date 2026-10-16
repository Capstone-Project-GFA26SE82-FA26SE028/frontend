import { z } from 'zod'

export const feedbackSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'Bạn hãy chọn số sao trước khi gửi nhé.')
    .max(5),
  comment: z.string().trim().max(1000, 'Nhận xét không quá 1.000 ký tự.'),
})

export type FeedbackFormValues = z.infer<typeof feedbackSchema>
