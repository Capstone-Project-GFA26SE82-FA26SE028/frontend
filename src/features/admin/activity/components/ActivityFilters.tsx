import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '../../../../components/Icon/Icon'
import { fieldClass, secondaryButton } from '../../components/AdminUI'
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
              className={fieldClass + ' pl-10'}
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
        <button type="submit" className={secondaryButton}>
          Tìm kiếm
        </button>
        <button
          type="button"
          className={secondaryButton}
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
