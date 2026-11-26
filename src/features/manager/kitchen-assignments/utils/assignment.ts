import axios from 'axios'
import { z } from 'zod'
import type {
  AssignmentStation,
  KitchenAssignment,
  KitchenEmployee,
} from '../types/assignment'

export function employeeName(employee?: KitchenEmployee | null) {
  return (
    employee?.fullName?.trim() ||
    employee?.userName ||
    'Không còn thông tin nhân viên'
  )
}
export function assignmentRows(
  stations: AssignmentStation[],
  assignments: KitchenAssignment[],
) {
  const byStation = new Map(
    assignments.map((item) => [item.kitchenStationId, item]),
  )
  return stations.map((station) => ({
    ...station,
    assignment: byStation.get(station.kitchenStationId),
  }))
}
export function matchesAssignment(value: string, search: string) {
  const normalize = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLocaleLowerCase('vi')
      .trim()
  return normalize(value).includes(normalize(search))
}
export function assignmentDenied(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    [401, 403].includes(error.response?.status || 0)
  )
}
export function assignmentError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return 'Phiên đăng nhập đã hết hạn.'
    if (error.response?.status === 403)
      return 'Bạn không có quyền quản lý phân công bếp tại nhà hàng này.'
    if (!error.response) return 'Không kết nối được máy chủ. Vui lòng thử lại.'
    const message = error.response.data?.message
    if (typeof message === 'string' && message.trim()) return message
  }
  if (error instanceof z.ZodError)
    return 'Dữ liệu phân công không hợp lệ. Vui lòng tải lại.'
  return error instanceof Error
    ? error.message
    : 'Không thể xử lý phân công bếp.'
}
