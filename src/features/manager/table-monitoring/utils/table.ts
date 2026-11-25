import axios from 'axios'
export function tableError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được máy chủ.'
    if (error.response.status >= 500) return 'Dịch vụ bàn đang gián đoạn.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message : 'Không thể tải dữ liệu bàn.'
  }
  return error instanceof Error ? error.message : 'Không thể tải dữ liệu bàn.'
}
