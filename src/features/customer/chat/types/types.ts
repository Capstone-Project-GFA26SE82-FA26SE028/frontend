export type ChatItem = {
  itemId: string
  itemName: string
  imageUrl: string | null
  price: number | null
  canOrder: boolean
  requiresOptionSelection: boolean
}

export type ChatTurn = {
  role: 'user' | 'assistant'
  content: string
}

export type ChatAnswer = {
  answer: string
  items: ChatItem[]
  searchLimited: boolean
  evaluatedAt: string
}

export type ChatMessage = ChatTurn & {
  items?: ChatItem[]
  searchLimited?: boolean
}

export type ChatResponse = {
  isSuccess: boolean
  message?: string | null
  result: ChatAnswer
}
