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
      title={`Order ${ticket.order}`}
      subtitle={`Dish line ${ticket.id}`}
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
          {ticket.note || 'No notes'}
        </p>
        {ticket.previousNote !== undefined && (
          <p className="text-sm text-slate-500">
            Before update: {ticket.previousNote}
          </p>
        )}
        <div className="flex justify-between text-sm">
          <span>{dish.area}</span>
          <strong>{ticket.status}</strong>
        </div>
        <p className="text-sm text-slate-500">
          Received {clock(ticket.created)}
          {ticket.started && ` · Started ${clock(ticket.started)}`}
          {ticket.finished && ` · Completed ${clock(ticket.finished)}`}
        </p>
      </div>
    </Modal>
  )
}
