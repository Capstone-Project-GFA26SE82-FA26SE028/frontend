import type { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import { NOTIFICATION_PAGE_SIZE } from '../constants/notification'
import {
  notificationEnvelopeSchema,
  notificationPageSchema,
  notificationDetailSchema,
  unreadCountSchema,
} from '../schemas/notificationSchema'
import type { NotificationFilters } from '../types/notification'

function result(data: unknown) {
  const envelope = notificationEnvelopeSchema.parse(data)
  if (!envelope.isSuccess)
    throw new Error(envelope.message || 'Không thể xử lý thông báo.')
  return envelope.result
}

async function get<T>(
  path: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
  params?: object,
) {
  const { data } = await axiosClient.get(path, { params, signal })
  return schema.parse(result(data))
}

export const notificationApi = {
  list: (filters: NotificationFilters, signal?: AbortSignal) =>
    get('/notifications', notificationPageSchema, signal, {
      page: filters.page,
      pageSize: NOTIFICATION_PAGE_SIZE,
      type: filters.type || undefined,
      isRead: filters.unreadOnly ? false : undefined,
    }),
  unread: (signal?: AbortSignal) =>
    get('/notifications/unread-count', unreadCountSchema, signal),
  detail: (id: string, signal?: AbortSignal) =>
    get(`/notifications/${id}`, notificationDetailSchema, signal),
  async markRead(id?: string) {
    const { data } = await axiosClient.patch(
      id ? `/notifications/${id}/read` : '/notifications/read-all',
    )
    result(data)
  },
}
