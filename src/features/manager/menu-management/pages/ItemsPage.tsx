import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { useDebounce } from '../../../../hooks/useDebounce'
import {
  Field,
  fieldClass,
  PageHeading,
  Pagination,
  primaryButton,
  SearchField,
  secondaryButton,
} from '../../../admin/components/AdminUI'
import { Panel } from '../../../../components/Panel/Panel'
import { FormActions } from '../components/FormActions'
import { ItemFormModal } from '../components/ItemFormModal'
import { MenuTabs } from '../components/MenuTabs'
import { QueryState } from '../components/QueryState'
import { availabilityLabels } from '../constants/catalog'
import { ItemList } from '../components/ItemList'
import { ItemCardGrid } from '../components/ItemCardGrid'
import { ItemViewToggle } from '../components/ItemViewToggle'
import { useItemViewMode } from '../hooks/useItemViewMode'
import { useCatalogMutation } from '../hooks/useCatalogMutation'
import { useCategoryChoices } from '../hooks/useCategoryChoices'
import { useItems } from '../hooks/useItems'
import { type Item } from '../types/catalog'

export function ItemsPage() {
  const { view, changeView } = useItemViewMode()
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const query = useDebounce(search, 300)
  const [form, setForm] = useState<{ item?: Item } | null>(null)
  const [target, setTarget] = useState<Item | null>(null)
  const categories = useCategoryChoices()
  const list = useItems(query, categoryId, status, page)
  const mutation = useCatalogMutation(() => {
    setForm(null)
    setTarget(null)
  })
  return (
    <>
      <PageHeading
        eyebrow="Thực đơn và giá bán"
        title="Món ăn"
        description="Quản lý thông tin món ăn và tình trạng bán."
        action={
          <button className={primaryButton} onClick={() => setForm({})}>
            <Icon name="plus" size={18} />
            Thêm món ăn
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
            placeholder="Tìm theo tên hoặc mã món…"
          />
          <select
            aria-label="Lọc theo danh mục"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value)
              setPage(1)
            }}
            className={`${fieldClass} sm:w-44`}
          >
            <option value="">Tất cả danh mục</option>
            {categories.data?.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
          <select
            aria-label="Lọc theo tình trạng bán"
            className={`${fieldClass} sm:w-48`}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(availabilityLabels).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
          <button
            className={secondaryButton}
            onClick={() => void list.refetch()}
            aria-label="Làm mới món ăn"
          >
            <Icon name="activity" size={18} />
          </button>
          <ItemViewToggle view={view} onChange={changeView} />
        </div>
        <QueryState
          pending={list.isPending}
          error={list.error}
          retry={() => void list.refetch()}
          empty={!list.data?.items.length}
        >
          {view === 'card' ? (
            <ItemCardGrid
              items={list.data?.items || []}
              onEdit={(item) => setForm({ item })}
              onStatus={setTarget}
            />
          ) : (
            <ItemList
              items={list.data?.items || []}
              onEdit={(item) => setForm({ item })}
              onStatus={setTarget}
            />
          )}
        </QueryState>
        <Pagination
          locale="vi"
          total={list.data?.totalCount || 0}
          page={page}
          size={10}
          onPage={setPage}
        />
      </Panel>
      {form && <ItemFormModal item={form.item} onClose={() => setForm(null)} />}
      {target && (
        <Modal
          closeLabel="Đóng"
          title="Cập nhật tình trạng bán"
          onClose={() => {
            if (!mutation.isPending) setTarget(null)
          }}
        >
          <form
            className="space-y-5 p-6"
            onSubmit={(e) => {
              e.preventDefault()
              mutation.mutate({
                method: 'patch',
                path: `/items/${target.itemId}/status`,
                body: {
                  availability: new FormData(e.currentTarget).get('status'),
                  version: target.version,
                },
              })
            }}
          >
            <p className="font-semibold">{target.itemName}</p>
            <Field label="Tình trạng bán">
              <select
                name="status"
                defaultValue={target.availability}
                className={fieldClass}
              >
                {Object.entries(availabilityLabels).map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <p className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-500">
              Để mở bán, món cần thuộc danh mục đang hoạt động, có giá tiêu
              chuẩn hợp lệ và công thức đang hiệu lực. Các đơn đã tạo không bị
              ảnh hưởng.
            </p>
            <FormActions
              pending={mutation.isPending}
              close={() => setTarget(null)}
            />
          </form>
        </Modal>
      )}
    </>
  )
}
