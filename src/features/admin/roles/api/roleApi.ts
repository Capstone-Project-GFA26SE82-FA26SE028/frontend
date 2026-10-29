import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type {
  SystemRole,
  RoleAccount,
  RoleUserQuery,
  RoleResponse,
  RoleUserPage,
} from '../types/types'

function result<T>(envelope: RoleResponse<T>): T {
  if (!envelope.isSuccess) throw new Error('Không thể hoàn tất yêu cầu.')
  return envelope.result
}
export async function getRoles(signal?: AbortSignal) {
  const { data } = await axiosClient.get<RoleResponse<SystemRole[]>>('/roles', {
    signal,
  })
  return result(data)
}
export async function getRoleUsers(
  params: RoleUserQuery,
  signal?: AbortSignal,
) {
  const { data } = await axiosClient.get<RoleResponse<RoleUserPage>>('/users', {
    params,
    signal,
  })
  return result(data)
}
export async function assignRole(userId: string, roleId: string) {
  const { data } = await axiosClient.patch<RoleResponse<RoleAccount>>(
    '/users/' + encodeURIComponent(userId) + '/role',
    { roleId },
  )
  return result(data)
}
export function roleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (!status) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    if (status >= 500)
      return 'Dịch vụ tài khoản đang gián đoạn. Vui lòng thử lại.'
    if (status === 401)
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    if (status === 403) return 'Bạn không có quyền quản lý vai trò.'
    if (status === 409)
      return 'Không thể đổi vai trò của quản trị viên đang hoạt động cuối cùng.'
    if (status === 404)
      return 'Tài khoản này không còn tồn tại. Vui lòng làm mới danh sách và thử lại.'
    if (status === 429) return 'Có quá nhiều yêu cầu. Vui lòng đợi rồi thử lại.'
    return 'Yêu cầu không hợp lệ. Vui lòng tải lại danh sách vai trò và thử lại.'
  }
  return error instanceof Error ? error.message : 'Không thể hoàn tất yêu cầu.'
}
