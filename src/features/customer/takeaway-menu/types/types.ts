export type TakeawayOption = {
  optionId: string
  optionName: string
  extraPrice: number
  availability: string
  canSelect: boolean
}
export type TakeawayOptionGroup = {
  optionGroupId: string
  optionGroupName: string
  minSelection: number
  maxSelection: number
  options: TakeawayOption[]
}
export type TakeawayDish = {
  itemId: string
  categoryId: string
  categoryName: string
  itemCode: string
  itemName: string
  description: string | null
  imageUrl: string | null
  availability: string
  price: number | null
  priceId: string | null
  channel: string
  evaluatedAt: string
  canOrder: boolean
  unavailableReason: string | null
  preparationTimeMinutes: number | null
  optionGroups: TakeawayOptionGroup[]
}
export type TakeawayMenuPage = {
  items: TakeawayDish[]
  totalCount: number
  page: number
  pageSize: number
}
export type TakeawayResponse<T> = {
  isSuccess: boolean
  message?: string | null
  result: T
}

export type TakeawaySelection = {
  itemId: string
  quantity: number
  note: string | null
  options: { optionId: string; quantity: number }[]
}
