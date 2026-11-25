import { z } from 'zod'
import {
  categorySchema,
  itemSchema,
  priceSchema,
} from '../schemas/catalogSchema'

export type Category = z.infer<typeof categorySchema>
export type Item = z.infer<typeof itemSchema>
export type ItemViewMode = 'card' | 'list'
export type ItemCollectionProps = {
  items: Item[]
  onEdit: (item: Item) => void
  onStatus: (item: Item) => void
}
export type Price = z.infer<typeof priceSchema>
export type Page<T> = {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}
export type PriceWrite = {
  itemId: string
  channel: string
  amount: number
  effectiveFrom: string
  effectiveTo: string | null
  dailyStart: string | null
  dailyEnd: string | null
}
export type PriceFormTarget = {
  mode: 'create' | 'edit' | 'replace'
  price?: Price
}
export type PriceInput = {
  itemId: string
  amount: number
  channel: string
  effectiveFrom: string
  effectiveTo: string | null
  dailyStart: string | null
  dailyEnd: string | null
}
