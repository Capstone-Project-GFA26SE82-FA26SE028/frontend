import { z } from 'zod'

const key = z.string().trim().max(512, 'Khóa tối đa 512 ký tự.')

export const payOsCredentialsSchema = z.object({
  clientId: z.string().trim().min(1, 'Nhập Client ID.').max(255, 'Client ID tối đa 255 ký tự.'),
  apiKey: key,
  checksumKey: key,
})

export const payOsSettingsSchema = payOsCredentialsSchema.extend({
  returnUrl: z.string().trim().max(2048),
  cancelUrl: z.string().trim().max(2048),
  enabled: z.boolean(),
})
