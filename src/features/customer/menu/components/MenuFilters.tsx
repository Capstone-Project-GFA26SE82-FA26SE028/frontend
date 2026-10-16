import { useLayoutEffect, useRef } from 'react'
import { MenuSearch } from './MenuSearch'
import { CategoryTabs } from './CategoryTabs'

type MenuFiltersProps = {
  search: string
  category: string
  filter: string
  sort: string
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onFilterChange: (value: string) => void
  onSortChange: (value: string) => void
}

export function MenuFilters({
  search,
  category,
  filter,
  sort,
  onSearchChange,
  onCategoryChange,
  onFilterChange,
  onSortChange,
}: MenuFiltersProps) {
  const categoryBar = useRef<HTMLDivElement>(null)
  const previousCategory = useRef(category)
  const previousSearch = useRef(search)

  useLayoutEffect(() => {
    if (
      (previousCategory.current !== category ||
        previousSearch.current !== search) &&
      window.matchMedia('(max-width: 767px)').matches
    ) {
      categoryBar.current?.scrollIntoView({
        block: 'start',
        behavior: 'instant',
      })
    }
    previousCategory.current = category
    previousSearch.current = search
  }, [category, search])

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Hôm nay, bạn muốn ăn gì?</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Thực đơn nhà Mộc<span className="text-brand">.</span>
          </h2>
          <p className="mt-3 text-sm text-muted">
            Một chút quen thuộc, một chút mới mẻ. Luôn có món dành cho bạn.
          </p>
        </div>
        <div className="hidden w-72 md:block">
          <MenuSearch value={search} onChange={onSearchChange} />
        </div>
      </div>
      <div ref={categoryBar} className="scroll-mt-20 md:hidden" />
      <div className="sticky top-20 z-10 -mx-5 mt-7 scroll-mt-20 bg-cream px-5 py-3 sm:-mx-8 sm:px-8 md:static md:mx-0 md:bg-transparent md:p-0">
        <div className="mb-2 md:hidden">
          <MenuSearch value={search} onChange={onSearchChange} />
        </div>
        <CategoryTabs value={category} onChange={onCategoryChange} />
      </div>
      <div className="my-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'popular', label: 'Được yêu thích' },
            { id: 'vegan', label: 'Món chay' },
            { id: 'spicy', label: 'Cay nhẹ' },
          ].map((f) => (
            <button
              key={f.id}
              aria-pressed={filter === f.id}
              onClick={() => onFilterChange(f.id)}
              className={`min-h-11 rounded-full px-3 text-xs font-medium ${filter === f.id ? 'bg-brand/10 text-brand' : 'text-muted hover:bg-stone-100'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted">
          Sắp xếp:
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="min-h-11 max-w-44 rounded-lg bg-transparent font-semibold text-ink"
          >
            <option value="default">Mộc đề xuất</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </label>
      </div>
    </>
  )
}
