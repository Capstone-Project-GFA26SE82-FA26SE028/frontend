import { axiosClient } from '../../../../api/axiosClient'

type Amount = { knownAmount: number; amount: number | null }
export type Totals = Record<
  | 'collections'
  | 'refunds'
  | 'netCollections'
  | 'dishRevenue'
  | 'netDishRevenue'
  | 'discounts'
  | 'vat'
  | 'serviceFees'
  | 'roundingAdjustment',
  Amount
> & { paidOrders: { knownCount: number; count: number | null } }
type Group = { key: string; totals: Totals }
type Warning = { code: string; message: string }
export type ReportResponses = {
  period: { timeZone: string; fromLocal: string; toLocal: string }
  sales: {
    totals: Totals
    groups: Group[]
    channels: Group[]
    methods: Group[]
    shifts: Group[]
    warnings: Warning[]
  }
  dishes: {
    items: {
      itemId: string
      names: string[]
      quantity: { knownQuantity: number; quantity: number | null }
      grossSales: Amount
      discounts: Amount
      netSales: Amount
      cost: Amount
      grossProfit: Amount
      contributionMarginPercent: number | null
    }[]
    warnings: Warning[]
  }
}
export async function getReport<K extends keyof ReportResponses>(
  id: string,
  kind: K,
  params: object,
  signal: AbortSignal,
) {
  const { data } = await axiosClient.get<{
    isSuccess: boolean
    message?: string
    result: ReportResponses[K]
  }>(`/restaurants/${id}/reports/${kind}`, { params, signal })
  if (!data.isSuccess) throw new Error(data.message || 'Không thể tải báo cáo.')
  return data.result
}
