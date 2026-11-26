import type { PaymentMethods } from '../schema'

export const mockPaymentMethods: PaymentMethods = {
  cash: true,
  payos: false,
  demoConnected: false,
  payosConfig: {
    clientId: '',
    apiKey: '',
    checksumKey: '',
    returnUrl: 'http://localhost:5173/payment/success',
    cancelUrl: 'http://localhost:5173/payment/cancel',
    webhookUrl: 'http://localhost:5000/api/billing/webhook/payos',
    enabled: false,
    configured: false,
  },
}
