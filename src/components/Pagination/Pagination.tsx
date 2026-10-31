import { Icon } from '../Icon/Icon'

// Số dòng mặc định dùng chung cho giao diện và các API danh sách.
export const PAGE_SIZE = 10

export function Pagination({
  total,
  page,
  onPage,
  size = PAGE_SIZE,
  locale = 'vi',
}: {
  total: number
  page: number
  onPage: (page: number) => void
  size?: number
  locale?: 'vi' | 'en'
}) {
  const pages = Math.max(1, Math.ceil(total / size))
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
      <p className="text-sm text-slate-500">
        {total
          ? `${(page - 1) * size + 1}–${Math.min(page * size, total)}`
          : '0'}{' '}
        {locale === 'en' ? 'of' : 'trên'} {total}{' '}
        {locale === 'en' ? 'results' : 'kết quả'}
      </p>
      <div className="flex items-center gap-2">
        <button
          aria-label={locale === 'en' ? 'Previous page' : 'Trang trước'}
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 px-3"
        >
          <Icon name="chevron" className="rotate-180" size={14} />
        </button>
        <span className="px-2 text-sm">
          {page} / {pages}
        </span>
        <button
          aria-label={locale === 'en' ? 'Next page' : 'Trang sau'}
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 px-3"
        >
          <Icon name="chevron" size={14} />
        </button>
      </div>
    </div>
  )
}
