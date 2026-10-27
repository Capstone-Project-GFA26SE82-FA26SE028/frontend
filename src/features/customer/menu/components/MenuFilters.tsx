import { MenuSearch } from './MenuSearch'
import { CategoryTabs } from './CategoryTabs'
import type { MenuCategory } from '../types'
export function MenuFilters({
  search,
  category,
  sort,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: {
  search: string
  category: string
  sort: string
  categories: MenuCategory[]
  onSearchChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onSortChange: (v: string) => void
}) {
  return (
    <>
      <div className="hidden justify-end md:flex">
        <div className="hidden w-72 md:block">
          <MenuSearch value={search} onChange={onSearchChange} />
        </div>
      </div>
      <div className="sticky top-20 z-10 -mx-5 md:mt-4 bg-cream px-5 py-3 sm:-mx-8 sm:px-8 md:static md:mx-0 md:bg-transparent md:p-0">
        <div className="mb-2 md:hidden">
          <MenuSearch value={search} onChange={onSearchChange} />
        </div>
        <CategoryTabs
          categories={categories}
          value={category}
          onChange={onCategoryChange}
        />
      </div>
      <div className="my-5 flex justify-end">
        <label className="flex items-center gap-2 text-xs text-muted">
          Sort by
          <select
            aria-label="Sort menu"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="min-h-11 rounded-lg bg-transparent font-semibold text-ink"
          >
            <option value="default">Default</option>
            <option value="asc">Price: low to high</option>
            <option value="desc">Price: high to low</option>
          </select>
        </label>
      </div>
    </>
  )
}
