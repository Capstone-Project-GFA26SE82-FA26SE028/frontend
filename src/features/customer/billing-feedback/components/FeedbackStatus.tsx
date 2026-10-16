import { Icon } from '../../../../components/Icon/Icon'
import type { InvoiceFeedback } from '../types'

export function FeedbackStatus({
  feedback,
  isPreview = false,
}: {
  feedback?: InvoiceFeedback
  isPreview?: boolean
}) {
  return (
    <section className="panel p-5 sm:p-7" role="status">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-mint text-brand">
        <Icon name={feedback ? 'check' : 'clock'} size={24} />
      </span>
      <h2 className="mt-5 text-xl font-bold">
        {feedback ? 'Cảm ơn bạn đã chia sẻ!' : 'Hẹn bạn sau bữa ăn'}
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted">
        {feedback
          ? isPreview
            ? 'Đánh giá mẫu đã được lưu trong phiên xem thử này.'
            : 'Đánh giá của bạn đã được ghi nhận.'
          : 'Bạn có thể gửi đánh giá sau khi hóa đơn được xác nhận đã thanh toán.'}
      </p>
      {feedback && (
        <>
          <div
            className="mt-5 flex gap-1 text-amber-600"
            aria-label={`${feedback.rating} trên 5 sao`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name="star"
                size={24}
                className={
                  star <= feedback.rating ? 'fill-amber-400' : 'text-stone-300'
                }
              />
            ))}
          </div>
          {feedback.comment && (
            <p className="mt-4 whitespace-pre-wrap break-words rounded-2xl bg-cream p-4 text-sm leading-6">
              {feedback.comment}
            </p>
          )}
          <p className="mt-4 text-xs text-muted">
            Hóa đơn này đã được đánh giá. Mộc rất trân trọng góp ý của bạn.
          </p>
        </>
      )}
    </section>
  )
}
