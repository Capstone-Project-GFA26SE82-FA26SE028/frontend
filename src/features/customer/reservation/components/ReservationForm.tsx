import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  reservationSchema,
  type ReservationFormValues,
} from '../schemas/reservationSchema'
import { Icon } from '../../../../components/Icon/Icon'
import { useSearchParams } from 'react-router-dom'
import { useReservation } from '../hooks/useReservation'
import { reservationError, type CreatedReservation } from '../api/reservationApi'
import { restaurantError } from '../../restaurants/api/restaurantApi'

type ReservationFormProps = {
  onSuccess: (reservation: CreatedReservation) => void
}

export function ReservationForm({ onSuccess }: ReservationFormProps) {
  const [params] = useSearchParams()
  const model = useReservation()
  const linkedRestaurant = params.get('restaurantId') || ''
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: '',
      phone: '',
      date: '',
      time: '',
      guests: 1,
      restaurantId: linkedRestaurant,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })
  const restaurantId = useWatch({ control, name: 'restaurantId' })

  return (
    <form noValidate onSubmit={handleSubmit(async (values) => {
      try {
        const result = await model.create.mutateAsync(values)
        onSuccess(result)
      } catch { /* Mutation error remains visible below. */ }
    })}>
      <h1 className="text-2xl font-semibold tracking-tight text-brand-dark sm:text-3xl">
        Đặt bàn
      </h1>
      <p className="mt-2 text-xs leading-5 text-amber-700">
        Gửi yêu cầu để nhà hàng kiểm tra bàn trống và liên hệ xác nhận. Giờ đến tính theo giờ Việt Nam (UTC+7).
      </p>
      <div className="mt-6 space-y-5 lg:space-y-4">
        <div className="text-sm font-semibold">
          <label htmlFor="reservation-restaurant">Nhà hàng</label>
          <select id="reservation-restaurant" className="field mt-2" {...register('restaurantId')} disabled={model.restaurants.isPending || isSubmitting} aria-invalid={!!errors.restaurantId}>
            <option value="">Chọn nhà hàng</option>
            {model.restaurants.data?.items.map((restaurant) => (
              <option key={restaurant.restaurantId} value={restaurant.restaurantId}>{restaurant.restaurantName}</option>
            ))}
          </select>
          {errors.restaurantId && <p role="alert" className="mt-2 text-sm text-red-700">{errors.restaurantId.message}</p>}
          {model.restaurants.isPending && <p role="status">Đang tải nhà hàng…</p>}
          {model.restaurants.error && <p role="alert" className="text-red-700">{restaurantError(model.restaurants.error)} <button type="button" onClick={() => void model.restaurants.refetch()}>Thử lại</button></p>}
        </div>
        <p className="text-sm text-muted">Nhà hàng sẽ sắp xếp khu vực và bàn phù hợp khi xác nhận yêu cầu.</p>
        <div className="text-sm font-semibold">
          <label htmlFor="reservation-name">Họ tên</label>
          <input
            id="reservation-name"
            {...register('name')}
            aria-invalid={!!errors.name}
            aria-describedby={
              errors.name ? 'reservation-name-error' : undefined
            }
            required
            maxLength={80}
            autoComplete="name"
            placeholder="Nhập họ và tên"
            className="field mt-2 min-h-13 bg-cream/70 font-normal focus:bg-white lg:min-h-0 lg:bg-white"
          />
          {errors.name && (
            <span
              id="reservation-name-error"
              role="alert"
              className="mt-2 block text-sm font-normal text-red-700"
            >
              {errors.name.message}
            </span>
          )}
        </div>
        <div className="text-sm font-semibold">
          <label htmlFor="reservation-phone">Số điện thoại</label>
          <input
            id="reservation-phone"
            {...register('phone')}
            aria-invalid={!!errors.phone}
            aria-describedby={
              errors.phone ? 'reservation-phone-error' : undefined
            }
            required
            type="tel"
            title="Số điện thoại gồm 10 chữ số bắt đầu bằng 0 hoặc +84 và 9 chữ số"
            autoComplete="tel"
            placeholder="090 123 4567"
            className="field mt-2 min-h-13 bg-cream/70 font-normal focus:bg-white lg:min-h-0 lg:bg-white"
          />
          {errors.phone && (
            <span
              id="reservation-phone-error"
              role="alert"
              className="mt-2 block text-sm font-normal text-red-700"
            >
              {errors.phone.message}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 lg:grid-cols-2">
          <div className="text-sm font-semibold">
            <label htmlFor="reservation-date">Ngày đến</label>
            <input
              id="reservation-date"
              required
              {...register('date')}
              aria-invalid={!!errors.date}
              aria-describedby={
                errors.date ? 'reservation-date-error' : undefined
              }
              type="date"
              className="field mt-2 min-h-13 min-w-0 bg-cream/70 font-normal focus:bg-white lg:min-h-0 lg:bg-white"
            />
            {errors.date && (
              <span
                id="reservation-date-error"
                role="alert"
                className="mt-2 block text-sm font-normal text-red-700"
              >
                {errors.date.message}
              </span>
            )}
          </div>
          <div className="text-sm font-semibold">
            <label htmlFor="reservation-time">Giờ đến</label>
            <input
              id="reservation-time"
              required
              {...register('time')}
              aria-invalid={!!errors.time}
              aria-describedby={
                errors.time ? 'reservation-time-error' : undefined
              }
              type="time"
              className="field mt-2 min-h-13 min-w-0 bg-cream/70 font-normal focus:bg-white lg:min-h-0 lg:bg-white"
            />
            {errors.time && (
              <span
                id="reservation-time-error"
                role="alert"
                className="mt-2 block text-sm font-normal text-red-700"
              >
                {errors.time.message}
              </span>
            )}
          </div>
        </div>
        <div className="text-sm font-semibold">
          <label htmlFor="reservation-guests">Số khách</label>
          <select
            id="reservation-guests"
            {...register('guests', { valueAsNumber: true })}
            aria-invalid={!!errors.guests}
            aria-describedby={
              errors.guests ? 'reservation-guests-error' : undefined
            }
            className="field mt-2 min-h-13 bg-cream/70 font-normal focus:bg-white lg:min-h-0 lg:bg-white"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <option key={n} value={n}>
                {n} người
              </option>
            ))}
          </select>
          {errors.guests && (
            <span
              id="reservation-guests-error"
              role="alert"
              className="mt-2 block text-sm font-normal text-red-700"
            >
              {errors.guests.message}
            </span>
          )}
        </div>
        {model.create.error && <p role="alert" className="text-sm text-red-700">{reservationError(model.create.error)}</p>}
        <button
          className="btn-primary min-h-14 w-full rounded-2xl shadow-md shadow-brand/15 lg:min-h-12 lg:shadow-none"
          type="submit"
          disabled={isSubmitting || !model.restaurants.data?.items.some((r) => r.restaurantId === restaurantId)}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Đang gửi yêu cầu…' : 'Gửi yêu cầu đặt bàn'} <Icon name="arrow" size={18} />
        </button>
      </div>
    </form>
  )
}
