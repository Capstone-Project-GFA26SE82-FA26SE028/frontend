import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field } from '../../../../components/Field/Field'
import { Icon } from '../../../../components/Icon/Icon'
import {
  activityFilterSchema,
  type ActivityFilterValues,
} from '../schemas/activityFilterSchema'

export function ActivityFilters({
  filters,
  onApply,
}: {
  filters: ActivityFilterValues
  onApply: (value: ActivityFilterValues) => void
}) {
  const [showFilters, setShowFilters] = useState(false)
  const filterCount = [
    filters.from,
    filters.to,
    filters.action,
    filters.userId,
  ].filter(Boolean).length
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityFilterValues>({
    resolver: zodResolver(activityFilterSchema),
    values: filters,
  })
  return (
    <form
      noValidate
      className="border-b border-slate-100"
      onSubmit={handleSubmit(onApply, () => setShowFilters(true))}
    >
      <div className="flex flex-wrap items-start gap-3 p-4">
        <div className="min-w-0 basis-full sm:basis-0 sm:flex-1">
          <label className="relative block">
            <span className="sr-only">Người thực hiện</span>
            <Icon
              name="search"
              size={18}
              className="pointer-events-none absolute left-3 top-3 text-slate-400"
            />
            <input
              {...register('search')}
              type="search"
              maxLength={255}
              placeholder="Tên, username hoặc email…"
              aria-invalid={!!errors.search}
              aria-describedby={
                errors.search ? 'activity-search-error' : undefined
              }
              className="field h-11 py-2 pl-10 text-sm"
            />
          </label>
          {errors.search && (
            <p
              id="activity-search-error"
              role="alert"
              className="mt-1 text-xs text-rose-600"
            >
              {errors.search.message}
            </p>
          )}
        </div>
        <button
          type="button"
          aria-expanded={showFilters}
          aria-controls="activity-filters"
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-stone-200 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <Icon name="settings" size={16} />
          Bộ lọc
          {filterCount > 0 && (
            <span className="rounded-full bg-mint px-1.5 text-xs text-brand">
              {filterCount}
            </span>
          )}
        </button>
        <button
          type="submit"
          className="h-11 rounded-xl bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Áp dụng
        </button>
        <button
          type="button"
          className="h-11 rounded-xl border border-stone-200 px-4 text-sm text-slate-500 hover:bg-slate-50 hover:text-brand"
          onClick={() => {
            const empty = {
              userId: '',
              search: '',
              action: '',
              from: '',
              to: '',
            }
            reset(empty)
            onApply(empty)
          }}
        >
          Đặt lại
        </button>
      </div>
      {showFilters && (
        <div
          id="activity-filters"
          className="border-t border-slate-100 bg-slate-50/60 p-4"
        >
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.5fr)] [&>div]:min-w-0 [&_input]:h-11 [&_input]:min-w-0 [&_input]:py-2 [&_input]:text-sm">
            <Field label="Từ ngày" error={errors.from?.message}>
              <input
                {...register('from')}
                type="date"
                className="field min-w-0"
              />
            </Field>
            <Field label="Đến ngày" error={errors.to?.message}>
              <input
                {...register('to')}
                type="date"
                className="field min-w-0"
              />
            </Field>
            <Field label="Thao tác" error={errors.action?.message}>
              <input
                {...register('action')}
                maxLength={100}
                placeholder="UPDATE_USER"
                className="field"
              />
            </Field>
            <Field
              label="Mã người dùng (tùy chọn)"
              error={errors.userId?.message}
            >
              <input {...register('userId')} className="field" />
            </Field>
          </div>
        </div>
      )}
    </form>
  )
}
