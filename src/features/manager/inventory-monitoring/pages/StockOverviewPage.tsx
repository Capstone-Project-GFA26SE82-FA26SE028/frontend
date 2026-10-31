import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDebounce } from '../../../../hooks/useDebounce'
import {
  fieldClass,
  PageHeading,
  Pagination,
  SearchField,
  secondaryButton,
  SummaryCards,
} from '../../../admin/components/AdminUI'
import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
import { matches } from '../../../admin/utils'
import { QueryState } from '../../menu-management/components/QueryState'
import { tableClass } from '../../menu-management/constants/styles'
import { InventoryTabs } from '../components/InventoryTabs'
import { StockRefresh } from '../components/StockRefresh'
import { useStock } from '../hooks/useStock'
import { stockStatus } from '../utils/stock'

export function StockOverviewPage() {
  const [search, setSearch] = useState('')
  const query = useDebounce(search)
  const [status, setStatus] = useState('')
  const [active, setActive] = useState('')
  const [page, setPage] = useState(1)
  const stock = useStock()
  const all = stock.data || []
  const filtered = all.filter(
    (ingredient) =>
      matches(query, ingredient.ingredientName, ingredient.ingredientCode) &&
      (!status || stockStatus(ingredient) === status) &&
      (!active || ingredient.isActive === (active === 'true')),
  )
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / 10)),
  )
  return (
    <>
      <PageHeading
        eyebrow="Theo dõi kho"
        title="Tổng quan tồn kho"
        description="Theo dõi tồn kho nguyên liệu, cảnh báo tồn thấp và lịch sử kho."
      />
      <InventoryTabs />
      <QueryState
        pending={stock.isPending}
        error={stock.error}
        retry={() => void stock.refetch()}
      >
        <SummaryCards
          items={[
            {
              label: 'Nguyên liệu',
              value: all.length,
              icon: 'leaf',
              note: 'Tất cả bản ghi nguyên liệu',
            },
            {
              label: 'Còn hàng',
              value: all.filter((i) => stockStatus(i) === 'In stock').length,
              icon: 'box',
              note: 'Trên ngưỡng cảnh báo',
            },
            {
              label: 'Tồn kho thấp',
              value: all.filter((i) => stockStatus(i) === 'Low stock').length,
              icon: 'bell',
              note: 'Tồn kho dương, bằng hoặc dưới ngưỡng',
            },
            {
              label: 'Hết hàng',
              value: all.filter((i) => stockStatus(i) === 'Out of stock')
                .length,
              icon: 'ban',
              note: 'Số lượng ghi nhận bằng 0 hoặc âm',
            },
          ]}
        />
        <Panel className="mb-5 p-4">
          <StockRefresh
            updatedAt={stock.dataUpdatedAt}
            refreshing={stock.isFetching}
            refresh={() => void stock.refetch()}
          />
          <p className="mt-3 text-xs leading-5 text-slate-400">
            Tồn kho hiển thị theo đơn vị cơ sở của từng nguyên liệu. Lượng giữ
            chỗ và lượng có thể sử dụng có thể khác số dư ghi nhận. Không cộng
            chung các số lượng khác đơn vị.
          </p>
        </Panel>
        <Panel>
          <div className="flex flex-wrap gap-3 border-b border-slate-100 p-4">
            <SearchField
              value={search}
              onChange={(value) => {
                setSearch(value)
                setPage(1)
              }}
              placeholder="Tìm tên hoặc mã nguyên liệu…"
            />
            <select
              aria-label="Trạng thái tồn kho"
              className={`${fieldClass} sm:w-44`}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
            >
              <option value="">Tất cả trạng thái tồn</option>
              {['In stock', 'Low stock', 'Out of stock'].map((value) => (
                <option key={value} value={value}>
                  {
                    {
                      'In stock': 'Còn hàng',
                      'Low stock': 'Tồn kho thấp',
                      'Out of stock': 'Hết hàng',
                    }[value]
                  }
                </option>
              ))}
            </select>
            <select
              aria-label="Tình trạng nguyên liệu"
              className={`${fieldClass} sm:w-44`}
              value={active}
              onChange={(event) => {
                setActive(event.target.value)
                setPage(1)
              }}
            >
              <option value="">Tất cả nguyên liệu</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Ngừng hoạt động</option>
            </select>
          </div>
          <QueryState
            pending={false}
            error={null}
            retry={() => void stock.refetch()}
            empty={!filtered.length}
          >
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className="bg-slate-50">
                  <tr>
                    <th>Nguyên liệu</th>
                    <th>Tồn kho</th>
                    <th>Ngưỡng cảnh báo</th>
                    <th>Trạng thái tồn kho</th>
                    <th>Hoạt động</th>
                    <th className="text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered
                    .slice((currentPage - 1) * 10, currentPage * 10)
                    .map((ingredient) => (
                      <tr key={ingredient.ingredientId}>
                        <td>
                          <p className="font-semibold">
                            {ingredient.ingredientName}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {ingredient.ingredientCode}
                          </p>
                        </td>
                        <td>
                          {ingredient.stockQuantity.toLocaleString('en-GB')}{' '}
                          {ingredient.baseUnit}
                        </td>
                        <td>
                          {ingredient.lowStockThreshold.toLocaleString('en-GB')}{' '}
                          {ingredient.baseUnit}
                        </td>
                        <td>
                          <Badge
                            tone={
                              stockStatus(ingredient) === 'In stock'
                                ? 'green'
                                : stockStatus(ingredient) === 'Low stock'
                                  ? 'amber'
                                  : 'red'
                            }
                          >
                            {
                              {
                                'In stock': 'Còn hàng',
                                'Low stock': 'Tồn kho thấp',
                                'Out of stock': 'Hết hàng',
                              }[stockStatus(ingredient)]
                            }
                          </Badge>
                        </td>
                        <td>
                          <Badge tone={ingredient.isActive ? 'green' : 'slate'}>
                            {ingredient.isActive
                              ? 'Đang hoạt động'
                              : 'Ngừng hoạt động'}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <Link
                            className={secondaryButton}
                            to={`/manager/stock-history?ingredientId=${ingredient.ingredientId}`}
                          >
                            Biến động và lô hàng
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </QueryState>
          <Pagination
            locale="vi"
            total={filtered.length}
            size={10}
            page={currentPage}
            onPage={setPage}
          />
        </Panel>
      </QueryState>
    </>
  )
}
