import { z } from 'zod'
const timestamp = z.string().datetime({ offset: true })
export const kitchenTaskSchema = z
  .object({
    kitchenTaskId: z.string(),
    kitchenStationId: z.string(),
    kitchenStationName: z.string(),
    orderId: z.string(),
    orderNumber: z.string(),
    originalTableId: z.string().nullable(),
    tableSessionId: z.string().nullable(),
    channel: z.string(),
    nameSnapshot: z.string(),
    quantity: z.number(),
    status: z.string(),
    queuedAt: timestamp,
    cookingAt: timestamp.nullable(),
    readyAt: timestamp.nullable(),
    dueAt: timestamp.nullable(),
    estimatedMinutes: z.number().nullable(),
    isLate: z.boolean(),
    priority: z.number(),
    note: z.string().nullable(),
    options: z.array(
      z.object({
        optionId: z.string(),
        name: z.string(),
        quantity: z.number(),
      }),
    ),
  })
  .transform((task) => ({
    ...task,
    taskId: task.kitchenTaskId,
    stationId: task.kitchenStationId,
    stationName: task.kitchenStationName,
    tableId: task.originalTableId || '',
    sessionId: task.tableSessionId || '',
    itemName: task.nameSnapshot,
  }))
export const tableSchema = z.object({
  tableId: z.string(),
  tableCode: z.string(),
})
export const summarySchema = z.object({
  pendingCount: z.number(),
  cookingCount: z.number(),
  readyCount: z.number(),
  avgCookingTimeMinutes: z.number(),
})
