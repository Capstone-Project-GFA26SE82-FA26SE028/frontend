import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTaxFee, getTaxFees, getEffectiveTaxFees } from '../api/taxFeeApi'
import { PAGE_SIZE } from '../../../../components/Pagination/Pagination'
import type { Fees } from '../schemas/taxFeeSchema'
import { useAppSelector } from '../../../../app/hooks'
export function useTaxFees() {
  const user = useAppSelector((state) => state.auth.session?.user)
  const restaurantId = user?.restaurantId
  const actorId = user?.userId
  const canManage =
    !!restaurantId && ['admin', 'manager'].includes(user?.roleId || '')
  const client = useQueryClient()
  const [now, setNow] = useState(Date.now)
  const [pagination, setPagination] = useState({
    restaurantId,
    actorId,
    page: 1,
  })
  const page =
    pagination.restaurantId === restaurantId && pagination.actorId === actorId
      ? pagination.page
      : 1
  const setPage = (page: number) =>
    setPagination({ restaurantId, actorId, page })
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  const params = {
    page,
    pageSize: PAGE_SIZE,
  }
  const list = useQuery({
    queryKey: ['tax-fee-policies', restaurantId, actorId, 'list', params],
    queryFn: ({ signal }) => getTaxFees(params, signal),
    enabled: canManage,
    placeholderData: (previous, query) =>
      query?.queryKey[1] === restaurantId && query?.queryKey[2] === actorId
        ? previous
        : undefined,
    staleTime: 30000,
    retry: false,
  })
  const effective = useQuery({
    queryKey: ['tax-fee-policies', restaurantId, actorId, 'effective'],
    queryFn: ({ signal }) => getEffectiveTaxFees(signal),
    enabled: canManage,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: false,
  })
  const save = useMutation({
    mutationFn: (values: Fees) => {
      if (!canManage)
        throw new Error('Tài khoản chưa có quyền cấu hình thuế cho nhà hàng.')
      return createTaxFee({
        vatRate: Number((values.vat / 100).toFixed(6)),
        serviceRate: Number((values.service / 100).toFixed(6)),
        serviceEnabled: values.serviceEnabled,
        ...(values.applyAt === 'scheduled'
          ? { effectiveFrom: new Date(values.effectiveAt).toISOString() }
          : {}),
      })
    },
    retry: false,
    onSuccess: async () => {
      setPage(1)
      await client.invalidateQueries({
        queryKey: ['tax-fee-policies', restaurantId, actorId],
      })
      toast.success('Đã lưu cấu hình VAT và phí dịch vụ.')
    },
  })
  const total = list.data?.totalCount || 0
  const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE))
  if (list.isSuccess && !list.isPlaceholderData && page > maxPage)
    setPage(maxPage)
  const fees = list.data?.items || []
  const current = effective.data?.find(
    (fee) => Date.parse(fee.effectiveAt) <= now,
  )
  async function refresh() {
    if (!canManage) return
    await Promise.all([list.refetch(), effective.refetch()])
  }
  return {
    list,
    effective,
    fees,
    current,
    now,
    save,
    total,
    page,
    setPage,
    refresh,
  }
}
