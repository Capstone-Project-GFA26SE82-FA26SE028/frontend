import { useState } from 'react'
import { RestaurantGrid } from '../components/RestaurantGrid'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import {
  PageHeading,
  Pagination,
  primaryButton,
  secondaryButton,
  fieldClass,
} from '../../components/AdminUI'
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
        title="Restaurants"
        description="Manage restaurant profiles and opening hours."
        action={
          <button
            className={primaryButton}
            onClick={() => management.setTarget({ mode: 'create' })}
          >
            <Icon name="plus" size={18} />
            Add restaurant
          </button>
        }
      />
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4">
          <span className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white">
            {management.search.trim() ? 'Results' : 'All'}{' '}
            <span className="ml-2 text-emerald-100">
              {list.data?.totalCount ?? '?'}
            </span>
          </span>
          <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
            <label className="relative min-w-0 flex-1 sm:w-80">
              <span className="sr-only">Search restaurants</span>
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
                placeholder="Search restaurant name..."
                className={fieldClass + ' pl-10'}
              />
            </label>
            <button
              className={secondaryButton}
              onClick={() => management.setSearch('')}
            >
              Reset
            </button>
            <div
              className="flex shrink-0 overflow-hidden rounded-xl border border-slate-200"
              role="group"
              aria-label="Restaurant view"
            >
              {(['grid', 'table'] as const).map((mode) => (
                <button
                  key={mode}
                  aria-label={mode === 'grid' ? 'Grid view' : 'Table view'}
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
            Loading restaurants...
          </p>
        ) : list.isError ? (
          <div className="space-y-3 p-8 text-center">
            <p role="alert" className="text-rose-600">
              {restaurantError(list.error)}
            </p>
            <button
              className={secondaryButton}
              onClick={() => void list.refetch()}
            >
              Try again
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
              locale="en"
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
              ? 'Add New Restaurant'
              : target.mode === 'edit'
                ? 'Edit restaurant'
                : detail.data?.restaurantName || 'Restaurant details'
          }
          subtitle={
            target.mode === 'create'
              ? 'Add your restaurant details and opening hours.'
              : target.mode === 'view'
                ? detail.data?.address
                : undefined
          }
          closeLabel="Close"
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
              Loading restaurant...
            </p>
          ) : detail.isError ? (
            <div className="space-y-3 p-8">
              <p role="alert" className="text-rose-600">
                {restaurantError(detail.error)}
              </p>
              <button
                className={secondaryButton}
                onClick={() => void detail.refetch()}
              >
                Try again
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
