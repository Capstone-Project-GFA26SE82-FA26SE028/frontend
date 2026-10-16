import { useForm, useController } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '../../../../components/Icon/Icon'
import {
  feedbackSchema,
  type FeedbackFormValues,
} from '../schemas/feedbackSchema'

const ratings = [
  'Chưa hài lòng',
  'Cần cải thiện',
  'Ổn',
  'Hài lòng',
  'Rất hài lòng',
]

export function FeedbackForm({
  onSubmit,
  isPreview,
}: {
  onSubmit: (values: FeedbackFormValues) => void
  isPreview: boolean
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rating: 0, comment: '' },
  })
  const { field: ratingField } = useController({ control, name: 'rating' })
  const rating = ratingField.value
  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="panel p-5 sm:p-7"
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-mint text-brand">
        <Icon name="heart" size={24} />
      </span>
      <h2 className="mt-5 text-xl font-bold">Bữa ăn của bạn thế nào?</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Chia sẻ về món ăn và cách phục vụ để Mộc chăm chút hơn cho lần hẹn tới.
      </p>
      <fieldset
        className="mt-6"
        aria-describedby={errors.rating ? 'rating-error' : undefined}
      >
        <legend className="text-sm font-semibold">
          Mức độ hài lòng <span className="text-brand">*</span>
        </legend>
        <div className="mt-3 flex gap-2">
          {ratings.map((label, index) => (
            <label key={label} className="relative cursor-pointer">
              <input
                type="radio"
                value={index + 1}
                name={ratingField.name}
                ref={index === 0 ? ratingField.ref : undefined}
                onBlur={ratingField.onBlur}
                checked={rating === index + 1}
                onChange={() => ratingField.onChange(index + 1)}
                aria-label={`${index + 1} sao — ${label}`}
                className="peer sr-only"
              />
              <span
                className={`flex size-11 items-center justify-center rounded-xl border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand ${rating >= index + 1 ? 'border-amber-300 bg-amber-50 text-amber-600' : 'border-stone-200 text-stone-400'}`}
              >
                <Icon
                  name="star"
                  size={26}
                  className={rating >= index + 1 ? 'fill-amber-400' : ''}
                />
              </span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-sm font-medium text-brand" aria-live="polite">
          {ratings[rating - 1] || 'Chọn từ 1 đến 5 sao'}
        </p>
        {errors.rating && (
          <p
            id="rating-error"
            role="alert"
            className="mt-2 text-sm text-red-700"
          >
            {errors.rating.message}
          </p>
        )}
      </fieldset>
      <label
        htmlFor="feedback-comment"
        className="mt-6 block text-sm font-semibold"
      >
        Lời nhắn cho Mộc{' '}
        <span className="font-normal text-muted">(không bắt buộc)</span>
      </label>
      <textarea
        id="feedback-comment"
        {...register('comment')}
        rows={4}
        maxLength={1000}
        aria-invalid={!!errors.comment}
        aria-describedby={errors.comment ? 'comment-error' : 'comment-hint'}
        placeholder="Món nào khiến bạn thích nhất? Mộc có thể làm tốt hơn điều gì?"
        className="field mt-2 resize-y"
      />
      <p id="comment-hint" className="mt-2 text-xs text-muted">
        Tối đa 1.000 ký tự · Mỗi hóa đơn được đánh giá một lần.
      </p>
      {errors.comment && (
        <p
          id="comment-error"
          role="alert"
          className="mt-2 text-sm text-red-700"
        >
          {errors.comment.message}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary mt-6 w-full"
      >
        {isPreview ? 'Gửi đánh giá mẫu' : 'Gửi đánh giá'}{' '}
        <Icon name="arrow" size={18} />
      </button>
    </form>
  )
}
