import axios from 'axios'
import { z } from 'zod'
import { axiosClient } from '../../../../api/axiosClient'
import type { UserAccount, UserQuery, UserRole } from '../types'
import type { AccountFormValues } from '../schemas/userSchema'

const userSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  email: z.string(),
  roleId: z.string(),
  fullName: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
})
const pageSchema = z.object({
  items: z.array(userSchema),
  totalCount: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
})
function result<T>(data: unknown, schema: z.ZodType<T>): T {
  const envelope = z
    .object({
      isSuccess: z.boolean(),
      message: z.string().optional(),
      result: z.unknown(),
    })
    .parse(data)
  if (!envelope.isSuccess)
    throw new Error('Unable to complete the request.')
  return schema.parse(envelope.result)
}
function mapUser(user: z.infer<typeof userSchema>): UserAccount {
  return {
    id: user.userId,
    userName: user.userName,
    name: user.fullName || user.userName,
    email: user.email,
    phone: user.phoneNumber || '',
    role: user.roleId,
    active: user.isActive,
    created: user.createdAt,
    updated: user.updatedAt,
    avatarUrl: user.avatarUrl,
  }
}
export function userApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Unable to connect to the server. Please try again.'
    if (error.response.status >= 500)
      return 'The account service is temporarily unavailable. Please try again.'
    if (error.response.status === 401) return 'Your session has expired.'
    if (error.response.status === 403)
      return 'You do not have permission to manage accounts.'
    const data = error.response.data
    const message = typeof data?.message === 'string' ? data.message : ''
    if (message.includes('Admin hoạt động cuối cùng'))
      return 'The last active administrator cannot be deactivated or reassigned.'
    if (message.includes('tự khóa')) return 'You cannot deactivate your own account.'
    if (message.includes('Role không tồn tại')) return 'The selected role no longer exists.'
    if (error.response.status === 409) return 'The email or username is already in use. Please choose another.'
    if (error.response.status === 404) return 'This account no longer exists. Refresh the list and try again.'
    if (error.response.status === 429) return 'Too many requests. Please wait and try again.'
    return 'Invalid request. Please check your details.'
  }
  if (error instanceof z.ZodError)
    return 'The server returned an unexpected response.'
  return error instanceof Error ? error.message : 'Unable to complete the request.'
}
export async function getUsers(params: UserQuery, signal?: AbortSignal) {
  const { data } = await axiosClient.get('/users', { params, signal })
  const page = result(data, pageSchema)
  return { ...page, items: page.items.map(mapUser) }
}
export async function getUser(id: string, signal?: AbortSignal) {
  const { data } = await axiosClient.get('/users/' + encodeURIComponent(id), {
    signal,
  })
  return mapUser(result(data, userSchema))
}
export async function getUserRoles(signal?: AbortSignal): Promise<UserRole[]> {
  const { data } = await axiosClient.get('/roles', { signal })
  return result(
    data,
    z.array(z.object({ roleId: z.string(), roleName: z.string() })),
  )
}
export async function saveUserAccount(
  values: AccountFormValues,
  existing?: UserAccount,
) {
  const body = {
    userName: values.userName,
    email: values.email,
    fullName: values.name,
    phoneNumber: values.phone,
    avatarUrl: values.avatarUrl,
  }
  const { data } = existing
    ? await axiosClient.put('/users/' + encodeURIComponent(existing.id), body)
    : await axiosClient.post('/users', {
        ...body,
        roleId: values.role,
        password: values.password,
      })
  return mapUser(result(data, userSchema))
}
export async function setUserStatus(id: string, isActive: boolean) {
  const { data } = await axiosClient.patch(
    '/users/' + encodeURIComponent(id) + '/status',
    { isActive },
  )
  return mapUser(result(data, userSchema))
}
