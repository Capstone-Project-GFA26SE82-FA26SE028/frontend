import axios from 'axios'
import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import type { SystemRole, RoleAccount, RoleUserQuery } from '../types'

const roleSchema: z.ZodType<SystemRole> = z.object({
  roleId: z.string(),
  roleName: z.string(),
  description: z.string().nullable(),
})
const accountSchema: z.ZodType<RoleAccount> = z.object({
  userId: z.string(),
  avatarUrl: z.string().nullable(),
  userName: z.string(),
  fullName: z.string().nullable(),
  email: z.string(),
  roleId: z.string(),
  isActive: z.boolean(),
})
const pageSchema = z.object({
  items: z.array(accountSchema),
  totalCount: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
})
function result<T>(data: unknown, schema: z.ZodType<T>): T {
  const envelope = z
    .object({ isSuccess: z.boolean(), result: z.unknown() })
    .parse(data)
  if (!envelope.isSuccess) throw new Error('Unable to complete the request.')
  return schema.parse(envelope.result)
}
export async function getRoles(signal?: AbortSignal) {
  const { data } = await axiosClient.get('/roles', { signal })
  return result(data, z.array(roleSchema))
}
export async function getRoleUsers(
  params: RoleUserQuery,
  signal?: AbortSignal,
) {
  const { data } = await axiosClient.get('/users', { params, signal })
  return result(data, pageSchema)
}
export async function assignRole(userId: string, roleId: string) {
  const { data } = await axiosClient.patch(
    '/users/' + encodeURIComponent(userId) + '/role',
    { roleId },
  )
  return result(data, accountSchema)
}
export function roleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (!status) return 'Unable to connect to the server. Please try again.'
    if (status >= 500)
      return 'The account service is temporarily unavailable. Please try again.'
    if (status === 401) return 'Your session has expired. Please sign in again.'
    if (status === 403) return 'You do not have permission to manage roles.'
    if (status === 409)
      return 'The last active administrator cannot be reassigned.'
    if (status === 404)
      return 'This account no longer exists. Refresh the list and try again.'
    if (status === 429) return 'Too many requests. Please wait and try again.'
    return 'The request is invalid. Refresh the available roles and try again.'
  }
  if (error instanceof z.ZodError)
    return 'The server returned an unexpected response.'
  return error instanceof Error
    ? error.message
    : 'Unable to complete the request.'
}
