import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RecipeModal } from './RecipeModal'
import { useKds } from '../hooks/useKds'
import { kdsApi, kdsError, kdsReadPolicy, kdsPollInterval } from '../api/kdsApi'

const button =
  'rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-800 disabled:opacity-40'

export function KdsOperations() {
  const { tasks, items, summary, batches, run, pending, stationId } = useKds()
  const [taskId, setTaskId] = useState('')
  const [priority, setPriority] = useState('0')
  const [reason, setReason] = useState('')
  const [course, setCourse] = useState('Dessert')
  const [history, setHistory] = useState(false)
  const [optionRecipe, setOptionRecipe] = useState<{
    id: string
    name: string
  }>()
  const selected = tasks.find((t) => t.kitchenTaskId === taskId)
  const detail = useQuery({
    ...kdsReadPolicy,
    queryKey: ['kitchen-live', 'detail', stationId, taskId],
    queryFn: ({ signal }) => kdsApi.task(taskId, signal),
    enabled: !!selected,
    refetchInterval: kdsPollInterval(5000),
  })
  const task = selected ? detail.data || selected : undefined
  const visible = tasks.filter(
    (t) => history || !['Served', 'Cancelled'].includes(t.status),
  )
  return (
    <section
      aria-label="Điều phối bếp"
      className="mb-5 space-y-4 rounded-xl border border-emerald-100 bg-white p-4"
    >
      {summary && (
        <p className="text-sm text-emerald-900">
          Thống kê món tại trạm: Chờ {summary.pendingCount} · Đang nấu{' '}
          {summary.cookingCount} · Sẵn sàng {summary.readyCount} · Thời gian nấu
          trung bình {summary.avgCookingTimeMinutes.toFixed(1)} phút
        </p>
      )}
      <details>
        <summary className="cursor-pointer font-semibold">
          Nấu theo mẻ ({batches.length} nhóm món đang chờ)
        </summary>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {batches.map((batch) => (
            <div
              key={`${batch.kitchenStationId}-${batch.itemId}`}
              className="rounded-lg border p-3"
            >
              <strong>
                {batch.itemName} · {batch.totalQuantity} phần
              </strong>
              <ul className="my-2 text-sm">
                {batch.tasks.map((t) => (
                  <li key={t.kitchenTaskId}>
                    {t.orderNumber} · {t.quantity} phần{' '}
                    {t.note && `· ${t.note}`}
                  </li>
                ))}
              </ul>
              <button
                className={button}
                disabled={pending || !batch.tasks.length}
                onClick={() =>
                  void run({
                    type: 'batch',
                    action: 'start',
                    taskIds: batch.tasks.map((t) => t.kitchenTaskId),
                  })
                }
              >
                Bắt đầu mẻ
              </button>
            </div>
          ))}
          {!batches.length && <p className="text-sm">Không có mẻ đang chờ.</p>}
          {[
            ...new Set(
              tasks.filter((t) => t.status === 'Cooking').map((t) => t.itemId),
            ),
          ].map((id) => {
            const lines = tasks.filter(
              (t) => t.itemId === id && t.status === 'Cooking',
            )
            return (
              <div key={id} className="rounded-lg border p-3">
                <p className="mb-2">
                  {lines[0].nameSnapshot} ·{' '}
                  {lines.reduce((n, t) => n + t.quantity, 0)} phần đang nấu
                </p>
                <button
                  className={button}
                  disabled={pending}
                  onClick={() =>
                    void run({
                      type: 'batch',
                      action: 'complete',
                      taskIds: lines.map((t) => t.kitchenTaskId),
                    })
                  }
                >
                  Hoàn thành mẻ
                </button>
              </div>
            )
          })}
        </div>
      </details>
      <details>
        <summary className="cursor-pointer font-semibold">
          Chi tiết, ưu tiên và xử lý món
        </summary>
        <label className="my-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={history}
            onChange={(e) => setHistory(e.target.checked)}
          />
          Hiện cả món đã phục vụ / đã hủy
        </label>
        <select
          aria-label="Chọn món cần xử lý"
          className="w-full rounded-lg border p-2"
          value={selected?.kitchenTaskId || ''}
          onChange={(e) => {
            setTaskId(e.target.value)
            setReason('')
            setPriority(
              String(
                tasks.find((t) => t.kitchenTaskId === e.target.value)
                  ?.priority || 0,
              ),
            )
          }}
        >
          <option value="">Chọn món</option>
          {visible.map((t) => (
            <option key={t.kitchenTaskId} value={t.kitchenTaskId}>
              {t.orderNumber} · {t.nameSnapshot} × {t.quantity} · {t.status}
            </option>
          ))}
        </select>
        {detail.isLoading && selected && (
          <p role="status">Đang tải chi tiết…</p>
        )}
        {detail.isError && selected && (
          <p role="alert">{kdsError(detail.error)}</p>
        )}
        {task && (
          <div className="mt-3 space-y-3 text-sm">
            <p>
              {task.kitchenStationName} · {task.channel || 'DineIn'} ·{' '}
              {task.status} · Ưu tiên {task.priority}
            </p>
            <p className="whitespace-pre-line">
              {task.note || 'Không có ghi chú'}
            </p>
            <p>
              Dự kiến: {task.estimatedMinutes ?? '—'} phút · Hạn hoàn thành:{' '}
              {task.dueAt ? new Date(task.dueAt).toLocaleString('vi-VN') : '—'}
              {task.isLate && ' · Đã trễ'}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {task.options.map((option, index) => (
                <button
                  key={option.optionId + ':' + index}
                  type="button"
                  className={button}
                  onClick={() =>
                    setOptionRecipe({ id: option.optionId, name: option.name })
                  }
                >
                  Công thức {option.quantity} × {option.name}
                </button>
              ))}
              <input
                aria-label="Mức ưu tiên"
                type="number"
                min="0"
                step="1"
                className="w-24 rounded-lg border p-2"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
              <button
                className={button}
                disabled={
                  pending ||
                  !Number.isSafeInteger(Number(priority)) ||
                  Number(priority) < 0 ||
                  !priority.trim()
                }
                onClick={() =>
                  void run({
                    type: 'priority',
                    id: task.kitchenTaskId,
                    priority: Number(priority),
                  })
                }
              >
                Lưu ưu tiên
              </button>
            </div>
            {task.channel !== 'Takeaway' && (
              <form
                className="flex flex-wrap gap-2"
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (
                    reason.trim() &&
                    (await run({
                      type: 'remake',
                      id: task.kitchenTaskId,
                      reason: reason.trim(),
                    }))
                  ) {
                    setTaskId('')
                    setReason('')
                  }
                }}
              >
                <input
                  required
                  aria-label="Lý do làm lại"
                  placeholder="Lý do làm lại món"
                  className="min-w-0 flex-1 rounded-lg border p-2"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <button className={button} disabled={pending || !reason.trim()}>
                  Làm lại món
                </button>
              </form>
            )}
            {task.status === 'Hold' && task.tableSessionId && (
              <div className="space-y-2">
                <p>
                  Kích hoạt toàn bộ món đang giữ của đơn này. Backend hiện chưa
                  lọc riêng theo course.
                </p>
                <div className="flex gap-2">
                  <input
                    aria-label="Tên đợt phục vụ"
                    className="min-w-0 flex-1 rounded-lg border p-2"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  />
                  <button
                    className={button}
                    disabled={pending || !course.trim()}
                    onClick={() =>
                      void run({
                        type: 'fire',
                        tableSessionId: task.tableSessionId!,
                        orderId: task.orderId,
                        course: course.trim(),
                      })
                    }
                  >
                    Kích hoạt món giữ
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </details>
      <details>
        <summary className="cursor-pointer font-semibold">
          Tình trạng thực đơn ({items.length} món)
        </summary>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.itemId}
              className="flex items-center justify-between gap-2 rounded-lg border p-2"
            >
              <span>
                {item.itemName} · {item.availability}
              </span>
              {item.availability === 'Available' && (
                <button
                  className={button}
                  disabled={pending}
                  onClick={() =>
                    void run({
                      type: 'availability',
                      id: item.itemId,
                      availability: 'OutOfStock',
                    })
                  }
                >
                  Báo hết món
                </button>
              )}
            </div>
          ))}
        </div>
      </details>
      {optionRecipe && (
        <RecipeModal
          option
          dish={{ ...optionRecipe, image: '' }}
          onClose={() => setOptionRecipe(undefined)}
        />
      )}
    </section>
  )
}
