import { useState } from 'react'
import { RestaurantGrid } from '../components/RestaurantGrid'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'

import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Pagination } from '../../../../components/Pagination/Pagination'
import { useRestaurants } from '../hooks/useRestaurants'
import { restaurantError } from '../api/restaurantApi'
import { RestaurantTable } from '../components/RestaurantTable'
import { RestaurantDetail } from '../components/RestaurantDetail'
import { RestaurantForm } from '../components/RestaurantForm'
export function RestaurantsPage() {
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const management = useRestaurants()
  const { list, detail, target, save } = management
  const close = () => {
    if (!save.isPending) management.setTarget(null)
  }
  return (
    <>
      <PageHeading
        title="Nhà hàng"
        description="Quản lý thông tin nhà hàng và giờ mở cửa."
        action={
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40"
            onClick={() => management.setTarget({ mode: 'create' })}
          >
            <Icon name="plus" size={18} />
            Thêm nhà hàng
          </button>
        }
      />
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4">
          <span className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white">
            {management.search.trim() ? 'Kết quả' : 'Tất cả'}{' '}
            <span className="ml-2 text-emerald-100">
              {list.data?.totalCount ?? '?'}
            </span>
          </span>
          <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
            <label className="relative min-w-0 flex-1 sm:w-80">
              <span className="sr-only">Tìm nhà hàng</span>
              <Icon
                name="search"
                size={18}
                className="pointer-events-none absolute left-3 top-3.5 text-slate-400"
              />
              <input
                type="search"
                maxLength={255}
                value={management.search}
                onChange={(e) => management.setSearch(e.target.value)}
                placeholder="Tìm tên nhà hàng…"
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 pl-10"
              />
            </label>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              onClick={() => management.setSearch('')}
            >
              Đặt lại
            </button>
            <div
              className="flex shrink-0 overflow-hidden rounded-xl border border-slate-200"
              role="group"
              aria-label="Cách hiển thị nhà hàng"
            >
              {(['grid', 'table'] as const).map((mode) => (
                <button
                  key={mode}
                  aria-label={mode === 'grid' ? 'Dạng thẻ' : 'Dạng bảng'}
                  aria-pressed={view === mode}
                  onClick={() => setView(mode)}
                  className={
                    'p-3 transition-colors ' +
                    (view === mode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50')
                  }
                >
                  <Icon name={mode === 'grid' ? 'grid' : 'menu'} size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
        {list.isPending ? (
          <p role="status" className="p-8 text-center text-slate-500">
            Đang tải danh sách nhà hàng…
          </p>
        ) : list.isError ? (
          <div className="space-y-3 p-8 text-center">
            <p role="alert" className="text-rose-600">
              {restaurantError(list.error)}
            </p>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
              onClick={() => void list.refetch()}
            >
              Thử lại
            </button>
          </div>
        ) : (
          <fieldset
            disabled={list.isPlaceholderData}
            aria-busy={list.isFetching}
            className="min-w-0"
          >
            {view === 'grid' ? (
              <RestaurantGrid
                items={list.data.items}
                onView={(id) => management.setTarget({ mode: 'view', id })}
                onEdit={(id) => management.setTarget({ mode: 'edit', id })}
              />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <RestaurantTable
                  items={list.data.items}
                  onView={(id) => management.setTarget({ mode: 'view', id })}
                  onEdit={(id) => management.setTarget({ mode: 'edit', id })}
                />
              </div>
            )}
            <Pagination
              locale="vi"
              total={list.data.totalCount}
              page={management.page}
              size={management.pageSize}
              onPage={management.changePage}
            />
          </fieldset>
        )}
      </div>
      {target && (
        <Modal
          title={
            target.mode === 'create'
              ? 'Thêm nhà hàng mới'
              : target.mode === 'edit'
                ? 'Sửa nhà hàng'
                : detail.data?.restaurantName || 'Chi tiết nhà hàng'
          }
          subtitle={
            target.mode === 'create'
              ? 'Nhập thông tin nhà hàng và giờ mở cửa.'
              : target.mode === 'view'
                ? detail.data?.address
                : undefined
          }
          closeLabel="Đóng"
          onClose={close}
          size="wide"
        >
          {target.mode === 'create' ? (
            <RestaurantForm
              key="create"
              pending={save.isPending}
              onCancel={close}
              onSave={(values) => save.mutateAsync({ values })}
            />
          ) : detail.isPending ? (
            <p role="status" className="p-8">
              Đang tải nhà hàng…
            </p>
          ) : detail.isError ? (
            <div className="space-y-3 p-8">
              <p role="alert" className="text-rose-600">
                {restaurantError(detail.error)}
              </p>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                onClick={() => void detail.refetch()}
              >
                Thử lại
              </button>
            </div>
          ) : (
            detail.data &&
            (target.mode === 'view' ? (
              <RestaurantDetail
                key={target.id}
                restaurant={detail.data}
                onClose={close}
                onEdit={() =>
                  management.setTarget({ mode: 'edit', id: target.id })
                }
              />
            ) : (
              <RestaurantForm
                key={target.id}
                restaurant={detail.data}
                pending={save.isPending}
                onCancel={close}
                onSave={(values) => save.mutateAsync({ values, id: target.id })}
              />
            ))
          )}
        </Modal>
      )}
    </>
  )
}
