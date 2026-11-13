export type CustomerMember = {
  customerId: string
  normalizedPhone: string
  customerName: string
  loyaltyTierId: string
  loyaltyTierName: string
  loyaltyTierCode: string
  discountPercent: number
  availablePoints: number
  totalSpent: number
}

export type LoyaltyTier = {
  loyaltyTierId: string
  loyaltyTierCode: string
  loyaltyTierName: string
  requiredSpend: number
  discountPercent: number
}

export type LoyaltyResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}
