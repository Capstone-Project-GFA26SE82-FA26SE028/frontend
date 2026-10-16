import { z } from 'zod'
export const paymentMethodsSchema = z.object({
  cash: z.boolean(),
  payos: z.boolean(),
  demoConnected: z.boolean(),
})
export type PaymentMethods = z.infer<typeof paymentMethodsSchema>
