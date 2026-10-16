import { useMemo, useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { dishes } from '../data/menu'
import { MenuBanner } from '../components/MenuBanner'
import { MenuFilters } from '../components/MenuFilters'
import { DishCard } from '../components/DishCard'
import { DishOptionModal } from '../components/DishOptionModal'
import type { Dish } from '../types'
export function MenuPage() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('default')
  const [selected, setSelected] = useState<Dish | null>(null)
  const [notice, setNotice] = useState('')
  const normalize = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .toLowerCase()
  const filtered = useMemo(() => {
    const list = dishes.filter(
      (d) =>
        (category === 'all' || d.category === category) &&
        normalize(d.name).includes(normalize(search)) &&
        (filter === 'all' ||
          (filter === 'vegan'
            ? d.vegetarian
            : filter === 'spicy'
              ? d.spicy
              : !!d.tag)),
    )
    return sort === 'default'
      ? list
      : [...list].sort((a, b) =>
          sort === 'asc' ? a.price - b.price : b.price - a.price,
        )
  }, [category, search, filter, sort])
  return (
    <>
      <MenuBanner image={dishes[0].image} />
      <section id="thuc-don" className="scroll-mt-28 pt-8 sm:pt-10">
        <MenuFilters
          search={search}
          category={category}
          filter={filter}
          sort={sort}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onFilterChange={setFilter}
          onSortChange={setSort}
        />
        <p className="sr-only" role="status">
          {filtered.length} món phù hợp
        </p>
        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filtered.map((d) => (
              <DishCard key={d.id} dish={d} onSelect={() => setSelected(d)} />
            ))}
          </div>
        ) : (
          <div className="panel py-16 text-center">
            <Icon name="search" className="mx-auto text-brand" size={36} />
            <h3 className="mt-4 text-xl font-bold">
              Chưa tìm thấy món phù hợp
            </h3>
            <p className="mt-2 text-sm text-muted">
              Thử tên món khác hoặc bỏ bớt bộ lọc nhé.
            </p>
            <button
              className="btn-secondary mt-5"
              onClick={() => {
                setSearch('')
                setCategory('all')
                setFilter('all')
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </section>
      <section className="my-10 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-mint p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <span className="hidden rounded-2xl bg-white p-4 text-brand sm:block">
            <Icon name="spark" size={28} />
          </span>
          <div>
            <p className="eyebrow">Một gợi ý nhỏ từ Mộc</p>
            <h2 className="mt-2 text-xl font-bold">
              Thêm chút tươi mát, bữa ăn thêm trọn vẹn.
            </h2>
            <p className="mt-2 text-sm text-muted">
              Một ly cam ép là người bạn đồng hành của món ngon hôm nay.
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelected(dishes[6])}
          className="btn-secondary border-brand/20 text-brand"
        >
          Khám phá đồ uống <Icon name="arrow" size={16} />
        </button>
      </section>
      {selected && (
        <DishOptionModal
          dish={selected}
          onClose={() => setSelected(null)}
          onAdded={() =>
            setNotice('Đã thêm món vào giỏ hàng. Chúc bạn ngon miệng!')
          }
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
            aria-label="Đóng thông báo"
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
