export const statusLabels = {
  Pending: 'Chờ duyệt',
  Provisioning: 'Đang cấp quyền',
  Approved: 'Đã duyệt',
}

export function registrationDate(value: string | null) {
  if (!value) return 'Chưa có'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Chưa có'
    : date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
}
