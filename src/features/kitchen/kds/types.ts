export type Status =
  'Pending' | 'Cooking' | 'Ready' | 'Hold' | 'Served' | 'Cancelled'

export type Ticket = {
  id: string
  order: string
  dishId: string
  quantity: number
  note: string
  vip: boolean
  priority?: number
  dueAt?: number
  isLate?: boolean
  estimatedMinutes?: number | null
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
export type KdsCommand =
  | { type: 'priority'; id: string; priority: number }
  | { type: 'remake'; id: string; reason: string }
  | { type: 'batch'; action: 'start' | 'complete'; taskIds: string[] }
  | { type: 'fire'; tableSessionId: string; orderId: string; course: string }
  | { type: 'availability'; id: string; availability: string }
  | {
      type: 'transition'
      id: string
      status: 'Cooking' | 'Ready' | 'Cancelled'
    }

export type KitchenItem = {
  itemId: string
  itemName: string
  imageUrl?: string | null
  kitchenStationId?: string | null
  availability: string
  version: string
}
export type KitchenIngredient = {
  ingredientId: string
  ingredientCode: string
  ingredientName: string
  baseUnit: string
  stockQuantity: number
  lowStockThreshold: number
  isActive: boolean
  isLowStock: boolean
}
export type ActiveRecipe = {
  version: number
  effectiveFrom: string
  instructions?: string | null
  ingredients: {
    ingredientRef: string
    baseQuantitySnapshot: number
    quantity?: number
    unitRef?: string
  }[]
  media?: { mediaType: string; url: string; displayOrder: number }[]
}
export type KitchenTask = {
  kitchenTaskId: string
  kitchenStationId: string
  kitchenStationName: string
  orderNumber: string
  channel?: string
  tableSessionId: string | null
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
  activeColumn?: 'all' | Status
}

export type KitchenSummary = {
  pendingCount: number
  cookingCount: number
  readyCount: number
  avgCookingTimeMinutes: number
}
export type KitchenBatch = {
  itemId: string
  itemName: string
  kitchenStationId: string
  totalQuantity: number
  tasks: {
    kitchenTaskId: string
    orderNumber: string
    quantity: number
    note?: string | null
  }[]
}
