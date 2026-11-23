import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBillingQueue } from '../api/tableBillingApi'
import type { BillingEntry, BillingTab } from '../types/types'
import { entryKey } from '../utils/billingDisplay'

export function useTableBilling(restaurantId: string, cashShiftId: string) {
  const [tab, setTab] = useState<BillingTab>('incoming')
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [areaId, setAreaId] = useState('')
  const [page, setPage] = useState(1)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const pageSize = 12
  const list = useQuery({
    queryKey: [
      'cashier',
      'billing-queue',
      restaurantId,
      cashShiftId,
      tab,
      page,
      search,
      areaId,
    ],
    queryFn: ({ signal }) =>
      getBillingQueue(
        restaurantId,
        tab,
        {
          cashShiftId,
          page,
          pageSize,
          search: search || undefined,
          areaId: areaId || undefined,
        },
        signal,
      ),
    retry: false,
  })
  const areas = useQuery({
    queryKey: ['cashier', 'billing-areas', restaurantId, cashShiftId, tab],
    queryFn: async ({ signal }) => {
      const options = new Map<string, string>()
      for (let index = 1; ; index++) {
        const batch = await getBillingQueue(
          restaurantId,
          tab,
          { cashShiftId, page: index, pageSize: 100 },
          signal,
        )
        for (const entry of batch.items) {
          for (const table of entry.tables)
            options.set(table.areaId, table.areaName)
        }
        if (
          !batch.items.length ||
          batch.page * batch.pageSize >= batch.totalCount
        )
          return [...options]
      }
    },
    staleTime: 30_000,
    retry: false,
  })
  const data = list.isSuccess ? list.data : undefined
  const selected = data?.items.find((entry) => entryKey(entry) === selectedKey)
  const groups = new Map<string, BillingEntry[]>()
  for (const entry of data?.items ?? []) {
    const names = [...new Set(entry.tables.map((table) => table.areaName))]
    const name = names.join(' · ') || 'Chưa có khu vực'
    groups.set(name, [...(groups.get(name) ?? []), entry])
  }
  const lastPage = Math.max(1, Math.ceil((data?.totalCount ?? 0) / pageSize))

  function changePage(next: number) {
    setSelectedKey(null)
    setPage(next)
  }

  return {
    tab,
    setTab,
    input,
    setInput,
    search,
    setSearch,
    areaId,
    setAreaId,
    page,
    selected,
    setSelectedKey,
    list,
    areas,
    data,
    groups,
    lastPage,
    changePage,
  }
}
