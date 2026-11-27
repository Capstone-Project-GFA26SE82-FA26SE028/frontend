import type { KitchenTask } from '../../kitchen-monitoring/types/operations'

export type OrderProgress = 'Pending' | 'Cooking' | 'Ready' | 'Cancelled'
export type MonitoredOrder = {
  orderId: string
  orderNumber: string
  channel: string
  tableIds: string[]
  sessionIds: string[]
  queuedAt: string
  progress: OrderProgress
  tasks: KitchenTask[]
}

export const progressLabels: Record<OrderProgress, string> = {
  Pending: 'Chờ bếp',
  Cooking: 'Đang xử lý',
  Ready: 'Bếp đã hoàn tất',
  Cancelled: 'Đã hủy toàn bộ',
}
export const taskLabels: Record<string, string> = {
  Pending: 'Chờ bếp',
  Cooking: 'Đang nấu',
  Ready: 'Đã xong',
  Cancelled: 'Đã hủy',
  Served: 'Đã phục vụ',
  Hold: 'Tạm giữ',
}
export function groupOrders(tasks: KitchenTask[]): MonitoredOrder[] {
  const groups = new Map<string, MonitoredOrder>()
  for (const task of tasks) {
    let order = groups.get(task.orderId)
    if (!order) {
      order = {
        orderId: task.orderId,
        orderNumber: task.orderNumber,
        channel: task.channel,
        tableIds: [],
        sessionIds: [],
        queuedAt: task.queuedAt,
        progress: 'Pending',
        tasks: [],
      }
      groups.set(task.orderId, order)
    }
    order.tasks.push(task)
    if (task.tableId && !order.tableIds.includes(task.tableId))
      order.tableIds.push(task.tableId)
    if (task.sessionId && !order.sessionIds.includes(task.sessionId))
      order.sessionIds.push(task.sessionId)
    if (Date.parse(task.queuedAt) < Date.parse(order.queuedAt))
      order.queuedAt = task.queuedAt
  }
  for (const order of groups.values()) {
    const active = order.tasks.filter((task) => task.status !== 'Cancelled')
    order.progress = !active.length
      ? 'Cancelled'
      : active.every(
            (task) => task.status === 'Ready' || task.status === 'Served',
          )
        ? 'Ready'
        : active.some(
              (task) =>
                task.status === 'Cooking' ||
                task.status === 'Ready' ||
                task.status === 'Served',
            )
          ? 'Cooking'
          : 'Pending'
  }
  return [...groups.values()].sort(
    (a, b) => Date.parse(b.queuedAt) - Date.parse(a.queuedAt),
  )
}
export function channelLabel(channel: string) {
  return channel === 'DineIn'
    ? 'Tại bàn'
    : channel === 'Takeaway'
      ? 'Mang đi'
      : channel
}
export function orderDate(value: string) {
  return new Date(value).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    dateStyle: 'short',
    timeStyle: 'short',
  })
}
export function orderDay(value: string) {
  return new Date(value).toLocaleDateString('sv-SE', {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
}
