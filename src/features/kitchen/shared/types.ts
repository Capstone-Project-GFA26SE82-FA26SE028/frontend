export type Status = 'Pending' | 'Cooking' | 'Ready' | 'Served' | 'Cancelled'
export type Ticket = {
  id: string
  order: string
  table: string
  dishId: string
  quantity: number
  note: string
  vip: boolean
  previousNote?: string
  created: number
  status: Status
  started?: number
  finished?: number
  reason?: string
}
export type Recipe = {
  id: string
  name: string
  area: string
  image: string
  version: string
  effective: string
  steps: string[]
  bom: { ingredient: string; amount: number }[]
  availability: 'Available' | 'Temporarily unavailable' | 'Paused'
}
export type Ingredient = { id: string; name: string; unit: string; min: number }
export type Lot = {
  id: string
  ingredient: string
  received: number
  expires: number
  quantity: number
}
export type Alert = {
  id: string
  ingredient: string
  note: string
  level: string
  time: number
  source: string
  status: 'Awaiting acknowledgment' | 'Acknowledged'
  area: string
}
export type KitchenState = {
  signedIn: boolean
  area: string
  tickets: Ticket[]
  recipes: Recipe[]
  ingredients: Ingredient[]
  lots: Lot[]
  alerts: Alert[]
  notifications: {
    id: string
    ticket: string
    time: number
    status: 'pending' | 'failed' | 'simulated'
    attempts: number
  }[]
  movements: { ticket: string; lot: string; amount: number; time: number }[]
  logs: {
    time: number
    actor: string
    text: string
    area: string
    ticket?: string
  }[]
  events: string[]
  feedback: { error: boolean; text: string } | null
}
export type Command =
  | { type: 'login'; area: string }
  | { type: 'logout' }
  | { type: 'receive'; eventId: string; ticket: Ticket }
  | { type: 'transition'; id: string; status: 'Cooking' | 'Ready' }
  | { type: 'cancel'; id: string; reason: string }
  | {
      type: 'availability'
      id: string
      status: Recipe['availability']
      reason: string
    }
  | { type: 'alert'; ingredient: string; level: string; note: string }
  | { type: 'notify'; id: string; fail: boolean }
  | { type: 'acknowledge'; id: string }
