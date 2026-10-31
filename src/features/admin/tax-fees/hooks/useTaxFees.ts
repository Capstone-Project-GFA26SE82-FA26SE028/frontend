import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTaxFee, getTaxFees } from '../api/taxFeeApi'
import type { Fees } from '../schemas/taxFeeSchema'
export function useTaxFees() {
  const client = useQueryClient()
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  const list = useQuery({
    queryKey: ['tax-fee-policies'],
    queryFn: ({ signal }) => getTaxFees(signal),
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
      await client.invalidateQueries({ queryKey: ['tax-fee-policies'] })
    },
  })
  const fees = list.data || []
  const current = fees.find((fee) => Date.parse(fee.effectiveAt) <= now)
  return { list, fees, current, now, save }
}
