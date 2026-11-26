import { z } from 'zod'

export const payOsConfigSchema = z.object({
  clientId: z.string().default(''),
  apiKey: z.string().default(''),
  checksumKey: z.string().default(''),
  returnUrl: z.string().default(''),
  cancelUrl: z.string().default(''),
  webhookUrl: z.string().default(''),
  enabled: z.boolean().default(false),
  configured: z.boolean().default(false),
})

export const paymentMethodsSchema = z.object({
  cash: z.boolean().default(true),
  payos: z.boolean().default(false),
  demoConnected: z.boolean().default(false),
  payosConfig: payOsConfigSchema.optional(),
})

export type PaymentMethods = z.infer<typeof paymentMethodsSchema>
export type PayOsConfig = z.infer<typeof payOsConfigSchema>
export type PaymentMethodKey = 'cash' | 'payos'
