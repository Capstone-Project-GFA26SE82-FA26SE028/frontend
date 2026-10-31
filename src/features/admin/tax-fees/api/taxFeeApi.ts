import axios from 'axios'
import { axiosClient } from '../../../../api/axiosClient'
import type {
  TaxFeePage,
  TaxFeePolicy,
  TaxFeeRequest,
  TaxFeeResponse,
  FeeVersion,
  TaxFeeQuery,
} from '../types/types'

function result<T>(data: TaxFeeResponse<T>): T {
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể tải cấu hình mức thu.')
  return data.result
}

function mapPolicy(policy: TaxFeePolicy): FeeVersion {
  return {
    id: policy.taxFeePolicyId,
    version: policy.version,
    vat: Number((policy.vatRate * 100).toFixed(4)),
    service: Number((policy.serviceRate * 100).toFixed(4)),
    serviceEnabled: policy.serviceEnabled,
    effectiveAt: policy.effectiveFrom,
  }
}

export async function getTaxFees(params: TaxFeeQuery, signal?: AbortSignal) {
  const { data } = await axiosClient.get<TaxFeeResponse<TaxFeePage>>(
    '/tax-fee-policies',
    {
      params,
      signal,
    },
  )
  const batch = result(data)
  return { ...batch, items: batch.items.map(mapPolicy) }
}

// The backend has no current-policy endpoint. Stop scanning once the current
// policy is found; keep scheduled policies so the UI updates when they take effect.
export async function getEffectiveTaxFees(
  signal?: AbortSignal,
): Promise<FeeVersion[]> {
  const policies: FeeVersion[] = []
  const now = Date.now()
  for (let page = 1; ; page++) {
    const batch = await getTaxFees({ page, pageSize: 100 }, signal)
    for (const policy of batch.items) {
      policies.push(policy)
      if (Date.parse(policy.effectiveAt) <= now) return policies
    }
    if (batch.page * batch.pageSize >= batch.totalCount) return policies
    if (!batch.items.length)
      throw new Error('Không thể tải cấu hình đang áp dụng. Vui lòng thử lại.')
  }
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
