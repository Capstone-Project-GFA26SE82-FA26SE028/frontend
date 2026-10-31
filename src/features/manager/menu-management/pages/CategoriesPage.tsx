import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { useDebounce } from '../../../../hooks/useDebounce'

import { SearchField } from '../../../../components/SearchField/SearchField'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { Field } from '../../../../components/Field/Field'
import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
import { FormActions } from '../components/FormActions'
import { MenuTabs } from '../components/MenuTabs'
import { QueryState } from '../components/QueryState'
import { tableClass } from '../constants/styles'
import { useCatalogMutation } from '../hooks/useCatalogMutation'
import { useCategories } from '../hooks/useCategories'
import { type Category } from '../types/catalog'

export function CategoriesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const query = useDebounce(search, 300)
  const [form, setForm] = useState<{ category?: Category } | null>(null)
  const [target, setTarget] = useState<{
    category: Category
    action: 'status' | 'delete'
  } | null>(null)
  const list = useCategories(query, status, page)
  const mutation = useCatalogMutation(() => {
    setForm(null)
    setTarget(null)
  })
  return (
    <>
      <PageHeading
        eyebrow="Thực đơn và giá bán"
        title="Danh mục"
        description="Sắp xếp thực đơn và quản lý trạng thái danh mục."
        action={
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
            onClick={() => setForm({})}
          >
            <Icon name="plus" size={18} />
            Thêm danh mục
          </button>
        }
      />
      <MenuTabs />
      <Panel>
        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-4">
          <SearchField
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder="Tìm theo tên hoặc mã danh mục…"
          />
          <select
            aria-label="Trạng thái danh mục"
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-52"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Ngừng hoạt động</option>
          </select>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
            onClick={() => void list.refetch()}
            aria-label="Làm mới danh mục"
          >
            <Icon name="activity" size={18} />
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
                  <th>Mã danh mục</th>
                  <th>Tên danh mục</th>
                  <th>Trạng thái</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.data?.items.map((category) => (
                  <tr
                    key={category.categoryId}
                    className="hover:bg-emerald-50/30"
                  >
                    <td className="text-slate-500">{category.categoryCode}</td>
                    <td className="font-semibold">{category.categoryName}</td>
                    <td>
                      <Badge tone={category.isActive ? 'green' : 'slate'}>
                        {category.isActive
                          ? 'Đang hoạt động'
                          : 'Ngừng hoạt động'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                          onClick={() => setForm({ category })}
                          aria-label={`Sửa ${category.categoryName}`}
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                          onClick={() =>
                            setTarget({ category, action: 'status' })
                          }
                        >
                          {category.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}
                        </button>
                        <button
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 text-rose-600"
                          onClick={() =>
                            setTarget({ category, action: 'delete' })
                          }
                          aria-label={`Xóa ${category.categoryName}`}
                        >
                          <Icon name="trash" size={16} />
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
          total={list.data?.totalCount || 0}
          page={page}
          onPage={setPage}
        />
      </Panel>
      {form && (
        <Modal
          closeLabel="Đóng"
          title={form.category ? 'Sửa danh mục' : 'Thêm danh mục'}
          onClose={() => {
            if (!mutation.isPending) setForm(null)
          }}
        >
          <form
            className="space-y-5 p-6"
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              mutation.mutate({
                method: form.category ? 'put' : 'post',
                path: form.category
                  ? `/categories/${form.category.categoryId}`
                  : '/categories',
                body: { categoryName: String(data.get('name')).trim() },
              })
            }}
          >
            <Field label="Tên danh mục *">
              <input
                name="name"
                autoFocus
                required
                maxLength={255}
                defaultValue={form.category?.categoryName}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Ví dụ: Món chính"
              />
            </Field>
            <FormActions
              pending={mutation.isPending}
              close={() => setForm(null)}
            />
          </form>
        </Modal>
      )}
      {target && (
        <Modal
          title={
            target.action === 'delete'
              ? 'Xóa danh mục?'
              : 'Đổi trạng thái danh mục?'
          }
          onClose={() => {
            if (!mutation.isPending) setTarget(null)
          }}
          closeLabel={'Đóng'}
        >
          <div className="space-y-5 p-6">
            <p className="text-sm leading-6 text-slate-600">
              {target.action === 'delete'
                ? `Xóa danh mục “${target.category.categoryName}”? Chỉ có thể xóa danh mục chưa có món liên kết.`
                : `${target.category.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'} danh mục “${target.category.categoryName}”? Không thể ngừng hoạt động danh mục còn món đang mở bán.`}
            </p>
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
                    method: target.action === 'delete' ? 'delete' : 'patch',
                    path: `/categories/${target.category.categoryId}${target.action === 'status' ? '/status' : ''}`,
                    body:
                      target.action === 'status'
                        ? { isActive: !target.category.isActive }
                        : undefined,
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
