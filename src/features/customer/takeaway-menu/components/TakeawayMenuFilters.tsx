import { Icon } from '../../../../components/Icon/Icon'

export function TakeawayMenuFilters({
  search,
  category,
  categories,
  onSearch,
  onCategory,
}: {
  search: string
  category: string
  categories: [string, string][]
  onSearch: (value: string) => void
  onCategory: (id: string) => void
}) {
  return (
    <>
      <div className="relative mb-5 max-w-md">
        <Icon
          name="search"
          size={18}
          className="absolute top-1/2 left-4 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          aria-label="Tìm món"
          placeholder="Tìm món bạn muốn ăn…"
          maxLength={255}
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="field pl-11"
        />
      </div>
      <div
        role="group"
        aria-label="Danh mục món"
        className="mb-6 flex flex-wrap gap-2"
      >
        <button
          type="button"
          aria-pressed={!category}
          onClick={() => onCategory('')}
          className={
            'rounded-full px-4 py-2.5 text-sm font-semibold ' +
            (!category
              ? 'bg-brand text-white'
              : 'border border-stone-200 bg-white')
          }
        >
          Tất cả món
        </button>
        {categories.map(([id, name]) => (
          <button
            key={id}
            type="button"
            aria-pressed={category === id}
            onClick={() => onCategory(id)}
            className={
              'rounded-full px-4 py-2.5 text-sm font-semibold ' +
              (category === id
                ? 'bg-brand text-white'
                : 'border border-stone-200 bg-white')
            }
          >
            {name}
          </button>
        ))}
      </div>
    </>
  )
}
