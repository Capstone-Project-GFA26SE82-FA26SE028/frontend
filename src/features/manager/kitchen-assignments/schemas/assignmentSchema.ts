import { z } from 'zod'

export const employeeSchema = z.object({
  userId: z.string().uuid(),
  fullName: z.string().nullish(),
  userName: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullish(),
  roleId: z.string(),
  isActive: z.boolean(),
})
export const assignmentSchema = z.object({
  kitchenStationId: z.string().uuid(),
  kitchenStationCode: z.string(),
  kitchenStationName: z.string(),
  stationActive: z.boolean(),
  userId: z.string().uuid(),
  employee: employeeSchema.nullable(),
})
export const stationSchema = z.object({
  kitchenStationId: z.string().uuid(),
  kitchenStationCode: z.string(),
  kitchenStationName: z.string(),
  isActive: z.boolean(),
})
export const envelopeSchema = z.object({
  isSuccess: z.boolean(),
  message: z.string().nullish(),
  result: z.unknown().optional(),
})
export const assignmentWriteSchema = z.object({
  userId: z.string().uuid('Vui lòng chọn nhân viên bếp hợp lệ.'),
})
