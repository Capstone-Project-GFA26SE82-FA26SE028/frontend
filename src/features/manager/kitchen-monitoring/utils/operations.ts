import type { KitchenTask } from '../types/operations'

export const taskLabels: Record<string, string> = {
  Pending: 'Waiting',
  Cooking: 'Cooking',
  Ready: 'Ready',
  Cancelled: 'Cancelled',
}
export function waitingMinutes(task: KitchenTask, now: number) {
  const end = task.cookingAt
    ? Date.parse(task.cookingAt)
    : task.readyAt
      ? Date.parse(task.readyAt)
      : now
  return Math.max(0, Math.floor((end - Date.parse(task.queuedAt)) / 60000))
}
export function isDelayed(task: KitchenTask, now: number) {
  return (
    task.status === 'Pending' && now - Date.parse(task.queuedAt) > 15 * 60000
  )
}
export function withinDays(at: string, from: string, until: string) {
  const time = Date.parse(at)
  return (
    (!from || time >= Date.parse(`${from}T00:00:00+07:00`)) &&
    (!until || time < Date.parse(`${until}T00:00:00+07:00`) + 86400000)
  )
}
