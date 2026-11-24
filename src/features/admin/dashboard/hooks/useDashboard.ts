import { useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../../app/hooks'
import { getAllAreas } from '../../areas/api/areaApi'
import { getAllTables } from '../../tables/api/tableApi'
import { useTaxFees } from '../../tax-fees/hooks/useTaxFees'
import { useUserCounts } from '../../users/hooks/useUsers'
export function useDashboard() {
  const methods = useAppSelector((s) => s.adminPaymentMethods)
  const userCounts = useUserCounts()
  const user = useAppSelector((s) => s.auth.session?.user)
  const restaurantId = user?.restaurantId || ''
  const layout = useQuery({
    queryKey: ['dashboard-layout', restaurantId, user?.userId],
    enabled: !!restaurantId,
    retry: false,
    queryFn: async ({ signal }) => {
      const [areas, tables] = await Promise.all([
        getAllAreas(restaurantId, signal),
        getAllTables({ restaurantId }, signal),
      ])
      return { areas, tables: tables.items }
    },
  })
  const { current: currentFees } = useTaxFees()
  const areas = layout.data?.areas || []
  const tables = layout.data?.tables || []
  const activeAreas = new Set(
    areas.filter((area) => area.isActive).map((area) => area.areaId),
  )
  const activeTables = tables.filter(
    (table) => table.isActive && activeAreas.has(table.areaId),
  ).length
  return {
    userCounts,
    tables,
    areas,
    layout,
    restaurantId,
    currentFees,
    methods,
    tableStatus: [
      {
        name: 'Đang hoạt động',
        value: activeTables,
        color: '#16805d',
      },
      {
        name: 'Ngừng hoạt động',
        value: tables.length - activeTables,
        color: '#d58a94',
      },
    ],
    userStatus: [
      {
        name: 'Hoạt động',
        value: userCounts.data?.active ?? 0,
        color: '#16805d',
      },
      {
        name: 'Bị khóa',
        value: userCounts.data?.locked ?? 0,
        color: '#d58a94',
      },
    ],
  }
}
