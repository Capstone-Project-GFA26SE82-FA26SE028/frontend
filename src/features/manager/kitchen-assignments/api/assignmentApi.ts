import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import {
  assignmentSchema,
  employeeSchema,
  envelopeSchema,
  stationSchema,
  assignmentWriteSchema,
} from '../schemas/assignmentSchema'
import type { AssignmentAction } from '../types/assignment'

function result(data: unknown) {
  const envelope = envelopeSchema.parse(data)
  if (!envelope.isSuccess)
    throw new Error(envelope.message || 'Không thể tải dữ liệu phân công.')
  return envelope.result
}
async function all<T>(
  path: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
) {
  const items: T[] = []
  for (let page = 1; ; page++) {
    const { data } = await axiosClient.get(path, {
      params: { page, pageSize: 100 },
      signal,
    })
    const batch = z
      .object({
        items: z.array(schema),
        totalCount: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
      })
      .parse(result(data))
    if (batch.page !== page)
      throw new Error('Phân trang không hợp lệ. Vui lòng tải lại.')
    items.push(...batch.items)
    if (items.length >= batch.totalCount) return items
    if (!batch.items.length)
      throw new Error('Chưa tải đủ dữ liệu. Vui lòng tải lại.')
  }
}
export const assignmentApi = {
  stations: (signal?: AbortSignal) =>
    all('/kitchen-stations', stationSchema, signal),
  assignments: (signal?: AbortSignal) =>
    all('/kitchen-assignments', assignmentSchema, signal),
  async employees(signal?: AbortSignal) {
    const { data } = await axiosClient.get('/kitchen-assignments/staff', {
      signal,
    })
    return z
      .array(employeeSchema)
      .parse(result(data))
      .filter((employee) => employee.isActive && employee.roleId === 'kitchen')
  },
  async write(action: AssignmentAction) {
    const path = `/kitchen-stations/${action.stationId}/assignment`
    if (action.kind === 'remove') {
      const { data } = await axiosClient.delete(path, {
        params: { expectedUserId: action.expectedUserId },
      })
      result(data)
      return
    }
    const body = {
      ...assignmentWriteSchema.parse({ userId: action.userId }),
      ...(action.expectedUserId
        ? { expectedUserId: action.expectedUserId }
        : {}),
    }
    const { data } = await axiosClient[action.expectedUserId ? 'put' : 'post'](
      path,
      body,
    )
    return assignmentSchema.parse(result(data))
  },
}
