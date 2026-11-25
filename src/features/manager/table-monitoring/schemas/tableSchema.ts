import { z } from 'zod'
export const tableSchema = z.object({
  tableId: z.string(),
  areaId: z.string(),
  tableCode: z.string(),
  capacity: z.number(),
  positionX: z.number().nullable(),
  positionY: z.number().nullable(),
  version: z.string(),
  isActive: z.boolean(),
  cleaningStatus: z.string(),
})
export const areaSchema = z.object({
  areaId: z.string(),
  restaurantId: z.string(),
  areaCode: z.string(),
  areaName: z.string(),
  serviceType: z.string(),
  spaceType: z.string(),
  isActive: z.boolean(),
})
