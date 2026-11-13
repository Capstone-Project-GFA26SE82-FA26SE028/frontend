export type RecommendedItem = {
  itemId: string
  itemName: string
  imageUrl: string | null
  price: number | null
  canOrder: boolean
  requiresOptionSelection: boolean
}

export type CartRecommendations = {
  cartId: string
  cartVersion: string
  message: string
  items: { item: RecommendedItem; reason: string }[]
  searchLimited: boolean
  evaluatedAt: string
}

export type RecommendationResponse = {
  isSuccess: boolean
  message?: string | null
  result: CartRecommendations
}
