import { cloneElement, useId, type ReactNode, type ReactElement } from 'react'
import { Icon } from '../../../components/Icon/Icon'
import { Modal } from '../../../components/Modal/Modal'
export const primaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40'
export const secondaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40'
export const fieldClass =
  'min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-[#102c30] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
      {action}
    </div>
  )
}
export function SummaryCards({
  items,
}: {
  items: { label: string; value: number | string; icon: string; note: string }[]
}) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className="flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white p-4"
        >
          <span
            className={`hidden size-11 shrink-0 items-center justify-center rounded-xl sm:flex ${['bg-emerald-50 text-emerald-700', 'bg-sky-50 text-sky-600', 'bg-amber-50 text-amber-600', 'bg-violet-50 text-violet-600'][i % 4]}`}
          >
            <Icon name={item.icon} size={22} />
          </span>
          <div className="min-w-0">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p
              className={`mt-1 break-words font-bold tracking-tight text-[#16382e] ${typeof item.value === 'string' ? 'text-lg sm:text-xl 2xl:text-2xl' : 'text-3xl'}`}
            >
              {item.value}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{item.note}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
export function EmptyState({
  title = 'Không tìm thấy kết quả',
  description = 'Thử thay đổi từ khóa hoặc bộ lọc.',
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="px-5 py-14 text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
        <Icon name="search" size={24} />
      </span>
      <h3 className="mt-4 font-semibold text-slate-700">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  )
}
export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <label className="relative block min-w-0 flex-1">
      <span className="sr-only">{placeholder}</span>
      <Icon
        name="search"
        size={18}
        className="absolute top-3.5 left-3 text-slate-400"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${fieldClass} pl-10`}
      />
    </label>
  )
}
export function Pagination({
  total,
  page,
  onPage,
  size = 6,
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
        {locale === 'en' ? 'of' : 'trên'} {total} {locale === 'en' ? 'results' : 'kết quả'}
      </p>
      <div className="flex items-center gap-2">
        <button
          aria-label={locale === 'en' ? 'Previous page' : 'Trang trước'}
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className={`${secondaryButton} px-3`}
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
          className={`${secondaryButton} px-3`}
        >
          <Icon name="chevron" size={14} />
        </button>
      </div>
    </div>
  )
}
export function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactElement<{
    id?: string
    'aria-describedby'?: string
    'aria-invalid'?: boolean
  }>
}) {
  const id = useId()
  return (
    <div className="block space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-600">
        {label}
      </label>
      {cloneElement(children, {
        id,
        'aria-describedby': error ? `${id}-error` : undefined,
        'aria-invalid': Boolean(error),
      })}
      {error && (
        <span
          id={`${id}-error`}
          role="alert"
          className="block text-xs text-rose-600"
        >
          {error}
        </span>
      )}
    </div>
  )
}
export function Notice({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
    >
      {children}
    </div>
  )
}
export function ConfirmAction({
  title,
  description,
  onClose,
  onConfirm,
  children,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  closeLabel,
  disabled = false,
}: {
  title: string
  description: string
  onClose: () => void
  onConfirm: () => void
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  closeLabel?: string
  disabled?: boolean
}) {
  return (
    <Modal title={title} onClose={onClose} closeLabel={closeLabel}>
      <div className="space-y-5 p-6">
        <p className="text-sm leading-6 text-slate-600">{description}</p>
        {children}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className={secondaryButton}>
            {cancelLabel}
          </button>
          <button
            disabled={disabled}
            onClick={onConfirm}
            className={primaryButton}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
