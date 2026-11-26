import { axiosClient } from '../../../../api/axiosClient'
import axios from 'axios'

export type Kind = 'promotions' | 'vouchers'
export type Target = {
  itemRef?: string | null
  categoryRef?: string | null
  role: string
  requiredQuantity: number
}
export type Offer = {
  promotionId?: string
  voucherId?: string
  promotionName?: string
  normalizedVoucherCode?: string
  discountType: string
  type?: string
  discountValue: number
  currentUsage: number
  usageLimit?: number | null
  minimumSpend?: number | null
  maximumDiscount?: number | null
  startAt: string
  endAt?: string | null
  isActive: boolean
  targets?: Target[]
}
type Envelope<T> = { isSuccess: boolean; result: T; message?: string }
function unwrap<T>(data: Envelope<T>) {
  if (!data.isSuccess)
    throw new Error(data.message || 'Không thể xử lý ưu đãi.')
  return data.result
}
export const offerId = (offer: Offer) => offer.promotionId || offer.voucherId
export const offerName = (offer: Offer) =>
  offer.promotionName || offer.normalizedVoucherCode
export async function listOffers(
  kind: Kind,
  params: object,
  signal: AbortSignal,
) {
  const { data } = await axiosClient.get<
    Envelope<{ items: Offer[]; totalCount: number }>
  >('/' + kind, { params, signal })
  return unwrap(data)
}
export async function getOffer(kind: Kind, id: string, signal: AbortSignal) {
  const { data } = await axiosClient.get<Envelope<Offer>>(
    '/' + kind + '/' + id,
    { signal },
  )
  return unwrap(data)
}
export async function writeOffer(
  kind: Kind,
  body: object,
  id?: string,
  status = false,
) {
  const path = '/' + kind + (id ? '/' + id : '') + (status ? '/status' : '')
  const { data } = await axiosClient[status ? 'patch' : id ? 'put' : 'post']<
    Envelope<Offer>
  >(path, body)
  return unwrap(data)
}
export async function targetChoices(
  path: '/items' | '/categories',
  signal: AbortSignal,
) {
  const choices: { id: string; name: string }[] = []
  for (let page = 1; ; page++) {
    const { data } = await axiosClient.get<
      Envelope<{
        items: {
          itemId?: string
          itemName?: string
          categoryId: string
          categoryName: string
        }[]
        totalCount: number
      }>
    >(path, { signal, params: { page, pageSize: 100 } })
    const result = unwrap(data)
    choices.push(
      ...result.items.map((row) => ({
        id: row.itemId || row.categoryId,
        name: row.itemName || row.categoryName,
      })),
    )
    if (choices.length >= result.totalCount) return choices
    if (!result.items.length) throw new Error('Chưa tải đủ danh sách áp dụng.')
  }
}
export function offerError(error: unknown) {
  if (
    axios.isAxiosError(error) &&
    typeof error.response?.data?.message === 'string'
  )
    return error.response.data.message
  return error instanceof Error ? error.message : 'Không thể xử lý ưu đãi.'
}
