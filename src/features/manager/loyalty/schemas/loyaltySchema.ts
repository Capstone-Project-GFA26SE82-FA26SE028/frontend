import { z } from 'zod'

export const tierSchema = z.object({
  // .NET Guid and seeded IDs do not require an RFC UUID version/variant.
  loyaltyTierId: z.guid(),
  loyaltyTierCode: z.string(),
  loyaltyTierName: z.string(),
  requiredSpend: z.number().finite().nonnegative(),
  discountPercent: z.number().min(0).max(100),
})
