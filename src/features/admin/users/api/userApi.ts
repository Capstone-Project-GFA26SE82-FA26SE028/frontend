import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type {
  UserAccount,
  UserQuery,
  UserRole,
  UserResponse,
  UserDto,
  UserPage,
} from '../types/types'
import type { AccountFormValues } from '../schemas/userSchema'

function result<T>(envelope: UserResponse<T>): T {
  if (!envelope.isSuccess) throw new Error('Không thể hoàn tất yêu cầu.')
  return envelope.result
}
function mapUser(user: UserDto): UserAccount {
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
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    if (error.response.status >= 500)
      return 'Dịch vụ tài khoản đang gián đoạn. Vui lòng thử lại.'
    if (error.response.status === 401) return 'Phiên đăng nhập đã hết hạn.'
    if (error.response.status === 403)
      return 'Bạn không có quyền quản lý tài khoản.'
    const data = error.response.data
    const message = typeof data?.message === 'string' ? data.message : ''
    if (
      message.includes('Admin hoạt động cuối cùng') ||
      message.includes('last active Admin')
    )
      return 'Không thể vô hiệu hóa hoặc đổi vai trò của quản trị viên đang hoạt động cuối cùng.'
    if (message.includes('tự khóa'))
      return 'Bạn không thể vô hiệu hóa tài khoản của chính mình.'
    if (message.includes('Role không tồn tại'))
      return 'Vai trò đã chọn không còn tồn tại.'
    if (error.response.status === 409)
      return 'Email hoặc tên đăng nhập đã được sử dụng. Vui lòng chọn thông tin khác.'
    if (error.response.status === 404)
      return 'Tài khoản này không còn tồn tại. Vui lòng làm mới danh sách và thử lại.'
    if (error.response.status === 429)
      return 'Có quá nhiều yêu cầu. Vui lòng đợi rồi thử lại.'
    return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra thông tin.'
  }
  return error instanceof Error ? error.message : 'Không thể hoàn tất yêu cầu.'
}
export async function getUsers(params: UserQuery, signal?: AbortSignal) {
  const { data } = await axiosClient.get<UserResponse<UserPage>>('/users', {
    params,
    signal,
  })
  const page = result(data)
  return { ...page, items: page.items.map(mapUser) }
}
export async function getUser(id: string, signal?: AbortSignal) {
  const { data } = await axiosClient.get<UserResponse<UserDto>>(
    '/users/' + encodeURIComponent(id),
    {
      signal,
    },
  )
  return mapUser(result(data))
}
export async function getUserRoles(signal?: AbortSignal): Promise<UserRole[]> {
  const { data } = await axiosClient.get<UserResponse<UserRole[]>>('/roles', {
    signal,
  })
  return result(data)
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
    ? await axiosClient.put<UserResponse<UserDto>>(
        '/users/' + encodeURIComponent(existing.id),
        body,
      )
    : await axiosClient.post<UserResponse<UserDto>>('/users', {
        ...body,
        roleId: values.role,
        password: values.password,
      })
  const saved = mapUser(result(data))
  if (existing && values.role !== saved.role) {
    try {
      return await setUserRole(existing.id, values.role)
    } catch (error) {
      throw new Error(
        `Đã lưu thông tin tài khoản. Đổi vai trò chưa được xác nhận: ${userApiError(error)}`,
        { cause: error },
      )
    }
  }
  return saved
}
export async function setUserStatus(id: string, isActive: boolean) {
  const { data } = await axiosClient.patch<UserResponse<UserDto>>(
    '/users/' + encodeURIComponent(id) + '/status',
    { isActive },
  )
  return mapUser(result(data))
}

export async function setUserRole(id: string, roleId: string) {
  const { data } = await axiosClient.patch<UserResponse<UserDto>>(
    '/users/' + encodeURIComponent(id) + '/role',
    { roleId },
  )
  return mapUser(result(data))
}
