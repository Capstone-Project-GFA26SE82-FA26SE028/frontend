import { useState } from 'react'
import { fieldClass, secondaryButton } from '../../components/AdminUI'
import { Icon } from '../../../../components/Icon/Icon'
import type { SessionRole, SessionCounts, SessionStatus } from '../types'
export function SessionFilters({
  search,
  status,
  role,
  date,
  device,
  mine,
  roles,
  counts,
  onSearch,
  onStatus,
  onRole,
  onDate,
  onDevice,
  onMine,
  onReset,
}: {
  search: string
  status: SessionStatus | ''
  role: string
  date: string
  device: string
  mine: boolean
  roles: SessionRole[]
  counts?: SessionCounts
  onSearch: (value: string) => void
  onStatus: (value: SessionStatus | '') => void
  onRole: (value: string) => void
  onDate: (value: string) => void
  onDevice: (value: string) => void
  onMine: (value: boolean) => void
  onReset: () => void
}) {
  const [moreFilters, setMoreFilters] = useState(false)
  const activeFilters = [role, date, device, mine].filter(Boolean).length
  const hasFilters = !!(search || status || activeFilters)
  const tabs = [
    { value: '', label: 'All', count: counts?.all, color: '' },
    {
      value: 'active',
      label: 'Active',
      count: counts?.active,
      color: 'bg-emerald-500',
    },
    {
      value: 'expired',
      label: 'Expired',
      count: counts?.expired,
      color: 'bg-amber-500',
    },
    {
      value: 'revoked',
      label: 'Revoked',
      count: counts?.revoked,
      color: 'bg-slate-400',
    },
  ] as const
  return (
    <>
      <div className="flex min-w-0 flex-col gap-3 p-4 xl:flex-row xl:items-center xl:justify-between">
        <div
          role="group"
          aria-label="Filter session status"
          className="flex min-w-0 gap-2 overflow-x-auto py-1"
        >
          {tabs.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={status === item.value}
              onClick={() => onStatus(item.value)}
              className={
                'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ' +
                (status === item.value
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-emerald-50')
              }
            >
              {item.color && (
                <span
                  aria-hidden="true"
                  className={
                    'size-2.5 rounded-full ' +
                    (status === item.value ? 'bg-white' : item.color)
                  }
                />
              )}
              {item.label}
              <span
                className={
                  status === item.value ? 'text-white/75' : 'text-slate-500'
                }
              >
                {item.count ?? '—'}
              </span>
            </button>
          ))}
        </div>
        <div className="flex min-w-0 items-center gap-2 xl:ml-auto xl:w-[min(45%,460px)]">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Search username or email</span>
            <Icon
              name="search"
              size={18}
              className="absolute left-3 top-3.5 text-slate-400"
            />
            <input
              type="search"
              maxLength={255}
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search username or email…"
              className={`${fieldClass} pl-10`}
            />
          </label>
          <button
            type="button"
            className={
              secondaryButton + ' inline-flex shrink-0 items-center gap-2'
            }
            aria-expanded={moreFilters}
            aria-controls="session-more-filters"
            onClick={() => setMoreFilters(!moreFilters)}
          >
            <Icon name="settings" size={16} />
            Filters
            {activeFilters > 0 && (
              <span className="rounded-full bg-emerald-100 px-1.5 text-xs text-emerald-800">
                {activeFilters}
              </span>
            )}
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={onReset}
              className="min-h-11 shrink-0 px-2 text-sm font-medium text-slate-600 hover:text-emerald-700"
            >
              Reset
            </button>
          )}
        </div>
      </div>
      {moreFilters && (
        <div
          id="session-more-filters"
          className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-3"
        >
          <select
            aria-label="Role"
            value={role}
            onChange={(event) => onRole(event.target.value)}
            className={`${fieldClass} sm:w-40 sm:shrink-0`}
          >
            <option value="">All roles</option>
            {roles.map((item) => (
              <option key={item.roleId} value={item.roleId}>
                {item.roleName}
              </option>
            ))}
          </select>
          <input
            aria-label="Login date"
            type="date"
            max="9999-12-31"
            value={date}
            onChange={(event) => onDate(event.target.value)}
            className={`${fieldClass} sm:w-40 sm:shrink-0`}
          />
          <select
            aria-label="Device"
            value={device}
            onChange={(event) => onDevice(event.target.value)}
            className={`${fieldClass} sm:w-48`}
          >
            <option value="">All devices</option>
            {['Desktop', 'Mobile', 'Tablet', 'Unknown'].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <label className="flex min-h-11 items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={mine}
              onChange={(event) => onMine(event.target.checked)}
              className="size-4 accent-emerald-700"
            />
            My sessions
          </label>
        </div>
      )}
    </>
  )
}
