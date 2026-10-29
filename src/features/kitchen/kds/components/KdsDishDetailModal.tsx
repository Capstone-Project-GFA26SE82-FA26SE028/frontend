import { Modal } from '../../../../components/Modal/Modal'
import { clock } from '../utils/format'
import type { Ticket, Dish } from '../types'

export function KdsDishDetailModal({
  ticket,
  dish,
  onClose,
  onRecipe,
}: {
  ticket: Ticket
  dish: Dish
  onClose: () => void
  onRecipe: (id: string) => void
}) {
  return (
    <Modal
      title={`Đơn ${ticket.order}`}
      subtitle={`Dòng món ${ticket.id}`}
      onClose={onClose}
    >
      <div className="space-y-4 p-6">
        <button
          type="button"
          className="block w-full"
          aria-label={`Xem công thức ${dish.name}`}
          onClick={() => {
            onClose()
            onRecipe(dish.id)
          }}
        >
          <img
            src={dish.image}
            alt={dish.name}
            className="h-44 w-full rounded-2xl object-cover"
          />
          <span className="mt-2 block text-sm font-semibold text-emerald-700">
            Bấm ảnh để xem công thức
          </span>
        </button>
        <h3 className="text-xl font-bold">
          {ticket.quantity} × {dish.name}
        </h3>
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          {ticket.note || 'Không có ghi chú'}
        </p>
        {ticket.previousNote !== undefined && (
          <p className="text-sm text-slate-500">
            Trước cập nhật: {ticket.previousNote}
          </p>
        )}
        <div className="flex justify-between text-sm">
          <span>{dish.area}</span>
          <strong>
            {
              {
                Pending: 'Chờ chế biến',
                Cooking: 'Đang chế biến',
                Ready: 'Sẵn sàng',
                Hold: 'Tạm hoãn',
                Served: 'Đã phục vụ',
                Cancelled: 'Đã hủy',
              }[ticket.status]
            }
          </strong>
        </div>
        <p className="text-sm text-slate-500">
          Nhận lúc {clock(ticket.created)}
          {ticket.started && ` · Bắt đầu ${clock(ticket.started)}`}
          {ticket.finished && ` · Hoàn thành ${clock(ticket.finished)}`}
        </p>
      </div>
    </Modal>
  )
}
