import type { ReactNode } from 'react'
import { Icon } from '../../../../components/Icon/Icon'

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-[.12em] text-emerald-700">
          Moc Restaurant · Operations
        </p>
        <h1 className="text-[28px] font-bold tracking-tight text-[#0b153b]">
          {title}
        </h1>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  )
}
export function Card({
  title,
  action,
  children,
  className = '',
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-[#e5edf1] bg-white p-5 shadow-[0_2px_8px_#16324f02] ${className}`}
    >
      {title && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[#101b3e]">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
export function Badge({
  children,
  tone = 'green',
}: {
  children: ReactNode
  tone?: 'green' | 'amber' | 'red' | 'blue' | 'gray'
}) {
  const colors = {
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-rose-50 text-rose-700',
    blue: 'bg-sky-50 text-sky-700',
    gray: 'bg-slate-100 text-slate-500',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${colors[tone]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}
export function Stats({
  items,
}: {
  items: {
    label: string
    value: string | number
    note: string
    icon: string
    tone?: string
  }[]
}) {
  return (
    <div className="mb-5 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
      {items.map((i) => (
        <Card key={i.label}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-500">{i.label}</p>
            <span
              className={`rounded-lg p-2.5 ${i.tone || 'bg-emerald-50 text-emerald-700'}`}
            >
              <Icon name={i.icon} size={20} />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-[#101b3e]">
            {i.value}
          </p>
          <p className="mt-2 text-xs text-slate-500">{i.note}</p>
        </Card>
      ))}
    </div>
  )
}
export function Search({
  value,
  onChange,
  placeholder = 'Search by name or ID…',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="relative block min-w-0 flex-1">
      <span className="sr-only">{placeholder}</span>
      <Icon
        name="search"
        size={17}
        className="absolute top-3 left-3 text-slate-400"
      />
      <input
        type="search"
        className="mgr-input pl-10!"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        className="mgr-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
    </label>
  )
}
export function Empty({
  text = 'No matching results. Try changing the filters.',
}: {
  text?: string
}) {
  return (
    <div className="py-14 text-center text-sm text-slate-500">
      <Icon name="search" className="mx-auto mb-3 text-slate-300" size={30} />
      {text}
    </div>
  )
}
export function DataTable({
  headers,
  children,
  empty = false,
}: {
  headers: string[]
  children: ReactNode
  empty?: boolean
}) {
  return (
    <div className="overflow-x-auto">
      <table className="mgr-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {empty && <Empty />}
    </div>
  )
}
