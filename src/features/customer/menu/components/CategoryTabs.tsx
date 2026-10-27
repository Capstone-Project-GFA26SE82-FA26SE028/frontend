import { useLayoutEffect, useRef } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import type { MenuCategory } from '../types'
export function CategoryTabs({
  categories,
  value,
  onChange,
}: {
  categories: MenuCategory[]
  value: string
  onChange: (id: string) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const list = listRef.current
    const active = list?.querySelector<HTMLButtonElement>(
      '[aria-pressed="true"]',
    )
    if (!list || !active || !window.matchMedia('(max-width: 767px)').matches)
      return
    const left = active.offsetLeft - list.offsetLeft
    if (
      left < list.scrollLeft ||
      left + active.offsetWidth > list.scrollLeft + list.clientWidth
    ) {
      list.scrollTo({
        left: left - (list.clientWidth - active.offsetWidth) / 2,
        behavior: 'instant',
      })
    }
  }, [value])

  return (
    <div
      ref={listRef}
      role="group"
      className="relative flex gap-2 overflow-x-auto py-1 md:flex-wrap md:overflow-visible"
      aria-label="Dish categories"
    >
      {[{ id: '', label: 'All dishes' }, ...categories].map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          aria-pressed={value === c.id}
          className={`flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-semibold transition-colors sm:px-5 ${value === c.id ? 'bg-brand text-white shadow-md shadow-brand/10' : 'border border-stone-200 bg-white text-muted hover:border-brand hover:text-brand'}`}
        >
          <Icon
            name={
              !c.id
                ? 'grid'
                : /\b(drinks?|beverages?|coffee|tea|juice)\b/i.test(c.label)
                  ? 'cup'
                  : 'utensils'
            }
            size={18}
          />
          {c.label}
        </button>
      ))}
    </div>
  )
}
