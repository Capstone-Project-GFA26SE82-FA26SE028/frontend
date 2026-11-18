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
    <div className="sticky top-[69px] z-20 -mx-4 mb-6 bg-[#faf9f6] px-4 py-3 sm:-mx-8 sm:px-8 lg:top-[87px]">
      <div className="mb-3 md:mb-4 md:flex md:justify-start">
        <label className="relative block w-full md:w-72">
          <span className="sr-only">Tìm món</span>
          <Icon
            name="search"
            className="pointer-events-none absolute top-3.5 left-4 text-muted"
          />
          <input
            type="search"
            aria-label="Tìm món"
            placeholder="Tìm món ăn…"
            maxLength={255}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="field pl-11"
          />
        </label>
      </div>
      <div
        role="group"
        aria-label="Danh mục món"
        className="relative flex flex-nowrap gap-2 overflow-x-auto py-1"
      >
        <button
          type="button"
          aria-pressed={!category}
          onClick={() => onCategory('')}
          className={
            'flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-semibold transition-colors sm:px-5 ' +
            (!category
              ? 'bg-brand text-white shadow-md shadow-brand/10'
              : 'border border-stone-200 bg-white text-muted hover:border-brand hover:text-brand')
          }
        >
          <Icon name="grid" size={18} />
          Tất cả món
        </button>
        {categories.map(([id, name]) => (
          <button
            key={id}
            type="button"
            aria-pressed={category === id}
            onClick={() => onCategory(id)}
            className={
              'flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-semibold transition-colors sm:px-5 ' +
              (category === id
                ? 'bg-brand text-white shadow-md shadow-brand/10'
                : 'border border-stone-200 bg-white text-muted hover:border-brand hover:text-brand')
            }
          >
            <Icon
              name={
                /\b(drinks?|beverages?|coffee|tea|juice)\b|đồ uống|nước uống|cà phê|trà/iu.test(
                  name,
                )
                  ? 'cup'
                  : 'utensils'
              }
              size={18}
            />
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
