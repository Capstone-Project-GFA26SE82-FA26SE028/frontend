import { type Price } from '../types/catalog'

export const dateLabel = (date: string) =>
  new Date(date).toLocaleString('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    dateStyle: 'short',
    timeStyle: 'short',
  })
export function localInput(date: string) {
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(date))
  return parts.replace(' ', 'T')
}
export const toUtc = (value: string) => new Date(`${value}+07:00`).toISOString()
export function priceState(price: Price) {
  const now = Date.now()
  if (new Date(price.effectiveFrom).getTime() > now)
    return { label: 'Scheduled', tone: 'blue' as const }
  if (price.effectiveTo && new Date(price.effectiveTo).getTime() <= now)
    return { label: 'Ended', tone: 'slate' as const }
  return { label: 'Effective', tone: 'green' as const }
}
