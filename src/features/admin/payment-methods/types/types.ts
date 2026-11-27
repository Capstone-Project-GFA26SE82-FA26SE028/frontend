export type PayOsConfiguration = {
  restaurantId: string
  configured: boolean
  clientId: string
  returnUrl: string
  cancelUrl: string
  webhookUrl: string
  enabled: boolean
}

export type PayOsCredentials = {
  clientId: string
  apiKey: string
  checksumKey: string
}

export type PayOsSettings = PayOsCredentials & {
  returnUrl: string
  cancelUrl: string
  enabled: boolean
}

export type PayOsTestQr = {
  accountName: string | null
  accountNumber: string | null
  bin: string | null
  description: string
  orderCode: number
  checkoutUrl: string | null
  amount: number
  qrCode: string | null
}
