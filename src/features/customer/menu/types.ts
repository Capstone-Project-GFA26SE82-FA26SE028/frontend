export type MenuOption = {
  optionId: string
  optionName: string
  extraPrice: number
  availability: string
  canSelect: boolean
}
export type MenuOptionGroup = {
  optionGroupId: string
  optionGroupName: string
  minSelection: number
  maxSelection: number
  options: MenuOption[]
}
export type Dish = {
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
  optionGroups: MenuOptionGroup[]
}
export type MenuCategory = { id: string; label: string }
export type OptionSelection = { optionGroupId: string; optionIds: string[] }
