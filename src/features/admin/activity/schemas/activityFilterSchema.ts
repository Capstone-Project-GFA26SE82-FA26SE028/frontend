import { z } from 'zod'
export const activityFilterSchema = z.object({
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
      'Enter a valid user ID.',
    ),
})
export type ActivityFilterValues = z.infer<typeof activityFilterSchema>
