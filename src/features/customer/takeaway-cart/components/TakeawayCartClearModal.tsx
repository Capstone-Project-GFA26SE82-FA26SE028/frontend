import { Modal } from '../../../../components/Modal/Modal'
import type { useTakeawayCart } from '../hooks/useTakeawayCart'
export function TakeawayCartClearModal({
  confirm,
  model,
  blocked,
  onClose,
}: {
  confirm: { index: number | null; version: string }
  model: ReturnType<typeof useTakeawayCart>
  blocked: boolean
  onClose: () => void
}) {
  const cart = model.cart.data
  return (
    <Modal
      title={confirm.index === null ? 'Xóa giỏ hàng?' : 'Xóa món?'}
      onClose={() => {
        if (!model.pending) onClose()
      }}
    >
      <div className="space-y-5 p-6">
        <p className="text-sm text-muted">
          {confirm.index === null
            ? 'Xóa tất cả món trong giỏ của nhà hàng này?'
            : 'Xóa món đã chọn khỏi giỏ hàng?'}
        </p>
        {(model.error || cart?.version !== confirm.version) && (
          <p role="alert" className="text-sm text-amber-800">
            {model.error ||
              'Giỏ hàng đã thay đổi. Đóng cửa sổ và tải lại giỏ hàng.'}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            disabled={model.pending}
            onClick={() => onClose()}
            className="btn-secondary"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={blocked || cart?.version !== confirm.version}
            onClick={async () => {
              if (!cart) return
              const items =
                confirm.index === null
                  ? []
                  : cart.items.filter((_, index) => index !== confirm.index)
              if (
                await model.changeItems(
                  items,
                  confirm.version,
                  confirm.index === null,
                )
              )
                onClose()
            }}
            className="rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white disabled:opacity-40"
          >
            {model.pending ? 'Đang xóa…' : 'Xóa'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
