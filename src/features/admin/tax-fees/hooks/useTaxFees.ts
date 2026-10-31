import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { createTaxFee, getTaxFees, getEffectiveTaxFees } from '../api/taxFeeApi'
import { PAGE_SIZE } from '../../../../components/Pagination/Pagination'
import type { Fees } from '../schemas/taxFeeSchema'
export function useTaxFees() {
  const client = useQueryClient()
  const [now, setNow] = useState(Date.now)
  const [page, setPage] = useState(1)
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  const params = {
    page,
    pageSize: PAGE_SIZE,
  }
  const list = useQuery({
    queryKey: ['tax-fee-policies', 'list', params],
    queryFn: ({ signal }) => getTaxFees(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 30000,
    retry: false,
  })
  const effective = useQuery({
    queryKey: ['tax-fee-policies', 'effective'],
    queryFn: ({ signal }) => getEffectiveTaxFees(signal),
    staleTime: 30000,
    refetchInterval: 60000,
    retry: false,
  })
  const save = useMutation({
    mutationFn: (values: Fees) =>
      createTaxFee({
        vatRate: Number((values.vat / 100).toFixed(6)),
        serviceRate: Number((values.service / 100).toFixed(6)),
        serviceEnabled: values.serviceEnabled,
        ...(values.applyAt === 'scheduled'
          ? { effectiveFrom: new Date(values.effectiveAt).toISOString() }
          : {}),
      }),
    retry: false,
    onSuccess: async () => {
      setPage(1)
      await client.invalidateQueries({ queryKey: ['tax-fee-policies'] })
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
