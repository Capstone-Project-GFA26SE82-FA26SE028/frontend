import type { z } from 'zod'
import type { notificationSchema } from '../schemas/notificationSchema'

export type KitchenNotification = z.infer<typeof notificationSchema>
export type NotificationFilters = {
  page: number
  type: string
  unreadOnly: boolean
}
