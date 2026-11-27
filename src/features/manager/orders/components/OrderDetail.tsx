import { Link } from 'react-router-dom'
import { Modal } from '../../../../components/Modal/Modal'
import { Badge } from '../../../../components/Badge/Badge'
import {
  channelLabel,
  orderDate,
  progressLabels,
  taskLabels,
  type MonitoredOrder,
} from '../utils/orders'

export function OrderDetail({
  order,
  tableName,
  onClose,
}: {
  order: MonitoredOrder
  tableName: (id: string) => string
  onClose: () => void
}) {
  return (
    <Modal
      title={`Order ${order.orderNumber}`}
      subtitle="Chi tiết các món đã chuyển bếp"
      size="wide"
      closeLabel="Đóng"
      onClose={onClose}
    >
      <div className="space-y-6 p-5 sm:p-6">
        <dl className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
          {[
            ['Mã order', order.orderNumber],
            ['Kênh bán', channelLabel(order.channel)],
            ['Bàn', order.tableIds.map(tableName).join(', ') || 'Không có bàn'],
            ['Chuyển bếp lần đầu (UTC+7)', orderDate(order.queuedAt)],
            ['Tiến độ bếp', progressLabels[order.progress]],
            [
              'Trạm bếp',
              [...new Set(order.tasks.map((task) => task.stationName))].join(
                ', ',
              ),
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-slate-500">{label}</dt>
              <dd className="mt-1 break-words font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        <section className="space-y-3">
          <h3 className="font-semibold">
            Các món trong bếp ({order.tasks.length})
          </h3>
          {order.tasks.map((task) => (
            <article
              key={task.taskId}
              className="space-y-3 rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold">
                    {task.itemName} × {task.quantity}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    {task.stationName}
                  </p>
                </div>
                <Badge
                  tone={
                    task.status === 'Cancelled'
                      ? 'red'
                      : task.status === 'Ready' || task.status === 'Served'
                        ? 'green'
                        : task.status === 'Cooking'
                          ? 'blue'
                          : 'amber'
                  }
                >
                  {taskLabels[task.status] || task.status}
                </Badge>
              </div>
              {!!task.options.length && (
                <ul className="space-y-1 text-sm text-slate-600">
                  {task.options.map((option) => (
                    <li key={option.optionId}>
                      {option.name} × {option.quantity}
                    </li>
                  ))}
                </ul>
              )}
              {task.note && (
                <p className="whitespace-pre-wrap break-words rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                  Ghi chú: {task.note}
                </p>
              )}
              <dl className="grid gap-2 text-xs sm:grid-cols-3">
                {[
                  ['Chuyển bếp', task.queuedAt],
                  ['Bắt đầu nấu', task.cookingAt],
                  ['Hoàn tất', task.readyAt],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="mt-1">
                      {value ? orderDate(value) : 'Chưa có'}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </section>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/manager/kitchen-monitoring"
            className="btn-primary min-h-11"
          >
            Mở trang tiến độ bếp
          </Link>
          <button onClick={onClose} className="btn-secondary min-h-11">
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  )
}
