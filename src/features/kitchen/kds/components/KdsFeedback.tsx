import { Icon } from '../../../../components/Icon/Icon'

export function KdsFeedback({
  message,
  onDismiss,
}: {
  message: string
  onDismiss: () => void
}) {
  return (
    <div
      className="sticky bottom-3 z-2 mt-4 ml-auto flex max-w-[430px] items-center justify-between gap-2.5 rounded-[10px] bg-[#173e32] px-4 py-[13px] text-sm text-white shadow-[0_6px_20px_#103f3220]"
      role="status"
    >
      <span>{message}</span>
      <button aria-label="Đóng thông báo bếp" onClick={onDismiss}>
        <Icon name="close" size={17} />
      </button>
    </div>
  )
}
