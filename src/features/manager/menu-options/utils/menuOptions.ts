import { isAxiosError } from 'axios'

export const input =
  'min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3'
export const title = {
  groups: 'Nhóm tùy chọn',
  options: 'Tùy chọn',
  links: 'Gán nhóm vào món',
}

export function menuOptionError(error: unknown) {
  if (isAxiosError(error) && error.response?.data?.message)
    return String(error.response.data.message)
  return error instanceof Error ? error.message : 'Có lỗi khi xử lý tùy chọn.'
}
