import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type {
  TaxFeePage,
  TaxFeePolicy,
  TaxFeeRequest,
  TaxFeeResponse,
  FeeVersion,
} from '../types/types'

function result<T>(data: TaxFeeResponse<T>): T {
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể tải cấu hình mức thu.')
  return data.result
}

// Future policies may fill several pages before the currently effective one.
export async function getTaxFees(signal?: AbortSignal): Promise<FeeVersion[]> {
  const policies = new Map<string, TaxFeePolicy>()
  for (let page = 1; ; page++) {
    const { data } = await axiosClient.get<TaxFeeResponse<TaxFeePage>>(
      '/tax-fee-policies',
      {
        params: { page, pageSize: 100 },
        signal,
      },
    )
    const batch = result(data)
    batch.items.forEach((item) => policies.set(item.taxFeePolicyId, item))
    if (batch.page * batch.pageSize >= batch.totalCount) break
    if (!batch.items.length)
      throw new Error('Không thể tải đủ lịch sử cấu hình. Vui lòng thử lại.')
  }
  return [...policies.values()]
    .map((policy) => ({
      id: policy.taxFeePolicyId,
      version: policy.version,
      vat: Number((policy.vatRate * 100).toFixed(4)),
      service: Number((policy.serviceRate * 100).toFixed(4)),
      serviceEnabled: policy.serviceEnabled,
      effectiveAt: policy.effectiveFrom,
    }))
    .sort(
      (a, b) =>
        Date.parse(b.effectiveAt) - Date.parse(a.effectiveAt) ||
        b.version - a.version,
    )
}

export async function createTaxFee(request: TaxFeeRequest) {
  const { data } = await axiosClient.post<TaxFeeResponse<TaxFeePolicy>>(
    '/tax-fee-policies',
    request,
  )
  return result(data)
}

export function taxFeeError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response)
      return 'Không kết nối được máy chủ. Tải lại lịch sử để kiểm tra cấu hình trước khi thử lưu lại.'
    return typeof error.response.data?.message === 'string'
      ? error.response.data.message
      : 'Không thể hoàn tất yêu cầu.'
  }
  return error instanceof Error ? error.message : 'Không thể hoàn tất yêu cầu.'
}
