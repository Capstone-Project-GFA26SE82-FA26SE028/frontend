import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '../../../../components/Icon/Icon'
import {
  phoneEntrySchema,
  type PhoneEntryValues,
} from '../schemas/phoneEntrySchema'

export function PhoneEntryForm({
  onSubmit,
}: {
  onSubmit: (values: PhoneEntryValues) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PhoneEntryValues>({
    resolver: zodResolver(phoneEntrySchema),
    defaultValues: { phone: '' },
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 space-y-5"
    >
      <div>
        <label htmlFor="entry-phone" className="text-sm font-semibold">
          Số điện thoại của bạn
        </label>
        <input
          {...register('phone')}
          id="entry-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="090 123 4567"
          className="field mt-2 min-h-14 text-lg"
          aria-invalid={!!errors.phone}
          aria-describedby={
            errors.phone ? 'entry-phone-error' : 'entry-phone-hint'
          }
        />
        {errors.phone ? (
          <p
            id="entry-phone-error"
            role="alert"
            className="mt-2 text-sm text-red-700"
          >
            {errors.phone.message}
          </p>
        ) : (
          <p
            id="entry-phone-hint"
            className="mt-2 text-xs leading-5 text-muted"
          >
            Nhập số điện thoại để bắt đầu chọn món tại bàn.
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary min-h-14 w-full"
      >
        Tiếp tục vào thực đơn <Icon name="arrow" size={18} />
      </button>
    </form>
  )
}
