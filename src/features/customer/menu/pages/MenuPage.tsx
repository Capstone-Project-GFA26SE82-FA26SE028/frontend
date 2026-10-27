import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { MenuBanner } from '../components/MenuBanner'
import { MenuFilters } from '../components/MenuFilters'
import { DishCard } from '../components/DishCard'
import { DishOptionModal } from '../components/DishOptionModal'
import { useMenu } from '../hooks/useMenu'
import { menuError } from '../api/menuApi'
export function MenuPage() {
  const m = useMenu()
  const [selected, setSelected] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  return (
    <>
      <MenuBanner />
      <section id="thuc-don" className="scroll-mt-28 pt-8 sm:pt-10">
        <MenuFilters
          search={m.search}
          category={m.category}
          sort={m.sort}
          categories={m.categories}
          onSearchChange={m.setSearch}
          onCategoryChange={m.setCategory}
          onSortChange={m.setSort}
        />
        {m.catalogue.isError && m.list.isSuccess && (
          <p role="alert" className="mb-4 text-sm text-amber-800">
            Categories could not be loaded.{' '}
            <button
              className="underline"
              onClick={() => void m.catalogue.refetch()}
            >
              Try again
            </button>
          </p>
        )}
        {m.list.isPending ? (
          <p role="status" className="panel py-12 text-center">
            Loading menu...
          </p>
        ) : m.list.isError ? (
          <div className="panel space-y-4 p-8 text-center">
            <p role="alert" className="text-rose-700">
              {menuError(m.list.error)}
            </p>
            <button
              className="btn-secondary"
              onClick={() => void m.list.refetch()}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <p role="status" className="mb-4 text-sm text-muted">
              {m.items.length} dishes{m.list.isFetching ? ' - Updating...' : ''}
            </p>
            {m.items.length ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {m.items.map((d) => (
                  <DishCard
                    key={d.itemId}
                    dish={d}
                    onSelect={() => setSelected(d.itemId)}
                  />
                ))}
              </div>
            ) : (
              <div className="panel py-16 text-center">
                <Icon name="search" className="mx-auto text-brand" size={36} />
                <h3 className="mt-4 text-xl font-bold">No dishes found</h3>
                <p className="mt-2 text-sm text-muted">
                  Try another name or category.
                </p>
                <button
                  className="btn-secondary mt-5"
                  onClick={() => {
                    m.setSearch('')
                    m.setCategory('')
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </section>
      {selected && m.sessionId && (
        <DishOptionModal
          key={m.sessionId + selected}
          sessionId={m.sessionId}
          itemId={selected}
          onClose={() => setSelected(null)}
          onAdded={() => setNotice('Added to your cart.')}
        />
      )}
      {notice && (
        <div
          role="status"
          className="fixed right-4 bottom-24 left-4 z-30 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-brand-dark p-4 text-sm text-white shadow-xl md:bottom-6"
        >
          <Icon name="check" />
          <span>{notice}</span>
          <button
            aria-label="Close notification"
            onClick={() => setNotice('')}
            className="ml-auto flex size-11 shrink-0 items-center justify-center"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </>
  )
}
