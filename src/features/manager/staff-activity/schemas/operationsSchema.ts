import { z } from 'zod'

export const tableSchema = z.object({
  tableId: z.string(),
  tableCode: z.string(),
  areaId: z.string(),
  areaName: z.string(),
  restaurantId: z.string(),
  cleaningStatus: z.string(),
  openSessionIds: z.array(z.string()),
})
export const kitchenTaskSchema = z.object({
  taskId: z.string(),
  orderId: z.string(),
  orderNumber: z.string(),
  tableId: z.string(),
  sessionId: z.string(),
  itemName: z.string(),
  quantity: z.number(),
  stationId: z.string(),
  stationName: z.string(),
  status: z.string(),
  queuedAt: z.string(),
  cookingAt: z.string(),
  readyAt: z.string(),
})
export const activitySchema = z.object({
  auditLogId: z.string(),
  userId: z.string().nullable(),
  action: z.string().nullable(),
  createdAt: z.string(),
  employeeName: z.string().optional(),
  tableCode: z.string().optional(),
  orderNumber: z.string().optional(),
  reason: z.string().optional(),
  beforeValue: z.string().optional(),
  afterValue: z.string().optional(),
})
