import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '../../../../components/Icon/Icon'

import {
  activityFilterSchema,
  type ActivityFilterValues,
} from '../schemas/activityFilterSchema'

export function ActivityFilters({
  userId,
  onApply,
}: {
  userId: string
  onApply: (value: string) => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityFilterValues>({
    resolver: zodResolver(activityFilterSchema),
    values: { userId },
  })
  return (
    <form
      className="border-b border-slate-100 p-4"
      onSubmit={handleSubmit((value) => onApply(value.userId))}
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 basis-full sm:basis-0 sm:flex-1">
          <label className="relative block">
            <span className="sr-only">Mã người dùng</span>
            <Icon
              name="search"
              size={18}
              className="pointer-events-none absolute left-3 top-3.5 text-slate-400"
            />
            <input
              {...register('userId')}
              type="search"
              maxLength={64}
              placeholder="Tìm theo mã người dùng…"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 pl-10"
              aria-invalid={!!errors.userId}
              aria-describedby={
                errors.userId ? 'activity-user-error' : undefined
              }
            />
          </label>
          {errors.userId && (
            <p
              role="alert"
              id="activity-user-error"
              className="mt-1 text-sm text-rose-600"
            >
              {errors.userId.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          Tìm kiếm
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
          onClick={() => {
            reset({ userId: '' })
            onApply('')
          }}
        >
          Đặt lại
        </button>
      </div>
    </form>
  )
}
