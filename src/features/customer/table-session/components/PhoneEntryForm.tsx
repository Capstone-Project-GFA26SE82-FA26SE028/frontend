import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  phoneEntrySchema,
  type PhoneEntryValues,
} from '../schemas/phoneEntrySchema'
export function PhoneEntryForm({
  onSubmit,
  pending = false,
  error,
}: {
  onSubmit: (values: PhoneEntryValues) => void
  pending?: boolean
  error?: string
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneEntryValues>({
    resolver: zodResolver(phoneEntrySchema),
    defaultValues: { phone: '' },
  })
  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="mt-7 space-y-3"
    >
      <label className="block text-sm font-semibold" htmlFor="entry-phone">
        Phone or table code
      </label>
      <input
        {...register('phone')}
        id="entry-phone"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={14}
        disabled={pending}
        placeholder="e.g. 0901234567 or 567"
        className="field min-h-12"
        aria-invalid={!!errors.phone}
        aria-describedby="entry-phone-help"
      />
      <details className="text-xs text-slate-500">
        <summary className="w-fit cursor-pointer py-1 text-emerald-700">
          Help
        </summary>
        <p id="entry-phone-help" className="mt-2 leading-5">
          First guest? Enter your phone number or choose a 3-digit code. The
          last 3 digits of your phone become the code. Others at your table
          should enter that code. Ask your server if you need help.
        </p>
      </details>
      {errors.phone && (
        <p role="alert" className="text-sm text-red-700">
          {errors.phone.message}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary mt-3 min-h-12 w-full"
      >
        {pending ? 'Joining...' : 'Continue'}
      </button>
    </form>
  )
}
