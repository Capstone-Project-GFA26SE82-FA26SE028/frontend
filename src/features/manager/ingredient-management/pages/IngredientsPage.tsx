import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { useDebounce } from '../../../../hooks/useDebounce'

import { SearchField } from '../../../../components/SearchField/SearchField'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
import { QueryState } from '../../menu-management/components/QueryState'
import { tableClass } from '../../menu-management/constants/styles'
import { IngredientForm } from '../components/IngredientForm'
import { IngredientTabs } from '../components/IngredientTabs'
import { useIngredientMutation } from '../hooks/useIngredientMutation'
import { useIngredients } from '../hooks/useIngredients'
import { useUnits } from '../hooks/useUnits'
import type { Ingredient } from '../types/ingredient'

export function IngredientsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [lowStock, setLowStock] = useState(false)
  const [page, setPage] = useState(1)
  const query = useDebounce(search)
  const [form, setForm] = useState<{ ingredient?: Ingredient } | null>(null)
  const [target, setTarget] = useState<Ingredient | null>(null)
  const list = useIngredients(query, status, lowStock, page)
  const units = useUnits()
  const mutation = useIngredientMutation(() => setTarget(null))
  return (
    <>
      <PageHeading
        eyebrow="Nguyên liệu và giá vốn"
        title="Nguyên liệu"
        description="Quản lý nguyên liệu, đơn vị cơ sở và ngưỡng cảnh báo tồn kho."
        action={
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
            onClick={() => setForm({})}
          >
            <Icon name="plus" size={18} />
            Thêm nguyên liệu
          </button>
        }
      />
      <IngredientTabs />
      <Panel>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <SearchField
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            placeholder="Tìm theo tên hoặc mã nguyên liệu…"
          />
          <select
            aria-label="Trạng thái nguyên liệu"
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-44"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
              setPage(1)
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Ngừng hoạt động</option>
          </select>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={lowStock}
              onChange={(event) => {
                setLowStock(event.target.checked)
                setPage(1)
              }}
            />
            Chỉ hiện tồn kho thấp
          </label>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
            onClick={() => void list.refetch()}
          >
            Làm mới
          </button>
        </div>
        <QueryState
          pending={list.isPending}
          error={list.error}
          retry={() => void list.refetch()}
          empty={!list.data?.items.length}
        >
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className="bg-slate-50/70">
                <tr>
                  <th>Nguyên liệu</th>
                  <th>Đơn vị cơ sở</th>
                  <th>Tồn kho</th>
                  <th>Ngưỡng cảnh báo</th>
                  <th>Trạng thái</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.data?.items.map((ingredient) => (
                  <tr
                    key={ingredient.ingredientId}
                    className="hover:bg-emerald-50/30"
                  >
                    <td>
                      <p className="font-semibold">
                        {ingredient.ingredientName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {ingredient.ingredientCode}
                      </p>
                    </td>
                    <td>{ingredient.baseUnit}</td>
                    <td>
                      <p>{ingredient.stockQuantity.toLocaleString('en-GB')}</p>
                      {ingredient.isLowStock && (
                        <Badge
                          tone={ingredient.stockQuantity <= 0 ? 'red' : 'amber'}
                        >
                          {ingredient.stockQuantity <= 0
                            ? 'Hết hàng'
                            : 'Tồn kho thấp'}
                        </Badge>
                      )}
                    </td>
                    <td>
                      {ingredient.lowStockThreshold.toLocaleString('en-GB')}
                    </td>
                    <td>
                      <Badge tone={ingredient.isActive ? 'green' : 'slate'}>
                        {ingredient.isActive
                          ? 'Đang hoạt động'
                          : 'Ngừng hoạt động'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Link
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                          to={`/manager/units?ingredientId=${ingredient.ingredientId}`}
                        >
                          Đơn vị
                        </Link>
                        <button
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                          onClick={() => setForm({ ingredient })}
                          aria-label={`Edit ${ingredient.ingredientName}`}
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                          onClick={() => setTarget(ingredient)}
                        >
                          {ingredient.isActive
                            ? 'Ngừng hoạt động'
                            : 'Kích hoạt'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </QueryState>
        <Pagination
          locale="vi"
          page={page}
          total={list.data?.totalCount || 0}
          onPage={setPage}
        />
      </Panel>
      {form && (
        <Modal
          closeLabel="Đóng"
          title={form.ingredient ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu'}
          onClose={() => setForm(null)}
        >
          <QueryState
            pending={units.isPending}
            error={units.error}
            retry={() => void units.refetch()}
          >
            {units.data?.length || form.ingredient ? (
              <IngredientForm
                ingredient={form.ingredient}
                units={units.data || []}
                close={() => setForm(null)}
              />
            ) : (
              <div className="space-y-3 p-6">
                <p className="text-sm text-slate-500">
                  Tạo đơn vị đo trước khi thêm nguyên liệu.
                </p>
                <Link
                  to="/manager/units"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
                >
                  Quản lý đơn vị
                </Link>
              </div>
            )}
          </QueryState>
        </Modal>
      )}
      {target && (
        <Modal
          title={`${target.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'} nguyên liệu?`}
          onClose={() => {
            if (!mutation.isPending) setTarget(null)
          }}
          closeLabel={'Đóng'}
        >
          <div className="space-y-5 p-6">
            <p className="text-sm leading-6 text-slate-600">{`Cập nhật trạng thái của “${target.ingredientName}”? Lịch sử kho hiện tại được giữ nguyên.`}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  if (!mutation.isPending) setTarget(null)
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              >
                {'Hủy'}
              </button>
              <button
                disabled={mutation.isPending}
                onClick={() =>
                  mutation.mutate({
                    method: 'patch',
                    path: `/ingredients/${target.ingredientId}/status`,
                    body: { isActive: !target.isActive },
                  })
                }
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
              >
                {'Xác nhận'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
