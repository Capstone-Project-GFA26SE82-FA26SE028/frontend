export type Status =
  | 'Pending'
  | 'Cooking'
  | 'Ready'
  | 'Hold'
  | 'Served'
  | 'Cancelled'

export type Ticket = {
  id: string
  order: string
  dishId: string
  quantity: number
  note: string
  vip: boolean
  previousNote?: string
  created: number
  status: Status
  started?: number
  finished?: number
}

export type Dish = { id: string; name: string; area: string; image: string }
export type KdsState = {
  signedIn: boolean
  area: string
  tickets: Ticket[]
  dishes: Dish[]
  feedback: { error: boolean; text: string } | null
}
export type KdsCommand = {
  type: 'transition'
  id: string
  status: 'Cooking' | 'Ready'
}

export type KitchenItem = {
  itemId: string
  itemName: string
  imageUrl?: string | null
  kitchenStationId?: string | null
  availability: string
  version: string
}
export type ActiveRecipe = {
  version: number
  effectiveFrom: string
  instructions?: string | null
  ingredients: { ingredientRef: string; baseQuantitySnapshot: number }[]
  media?: { mediaType: string; url: string; displayOrder: number }[]
}
export type KitchenTask = {
  kitchenTaskId: string
  kitchenStationId: string
  kitchenStationName: string
  orderNumber: string
  tableSessionId: string
  orderId: string
  orderItemId: string
  originalTableId?: string | null
  itemId: string
  nameSnapshot: string
  quantity: number
  note?: string | null
  status: string
  priority: number
  queuedAt: string
  cookingAt?: string | null
  readyAt?: string | null
  estimatedMinutes?: number | null
  dueAt?: string | null
  isLate: boolean
  version: string
  options: { optionId: string; name: string; quantity: number }[]
}
export type Station = {
  kitchenStationId: string
  kitchenStationCode: string
  kitchenStationName: string
}
export type Page<T> = {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}
export type KdsOrder = {
  id: string
  lines: Ticket[]
  created: number
  vip: boolean
  status: Status
}
export type KdsColumnDefinition = {
  status: Status
  title: string
  icon: string
  tone: 'waiting' | 'cooking' | 'ready' | 'hold'
}
export type KdsActions = {
  onSelect: (id: string) => void
  onRecipe: (id: string) => void
  onTransition: (ticket: Ticket) => void | Promise<void>
}
export type KdsBoardProps = KdsActions & {
  shown: KdsOrder[]
  active: Ticket[]
  dishes: Dish[]
  now: number
  late: (ticket: Ticket) => boolean
  isFiltered: boolean
}
