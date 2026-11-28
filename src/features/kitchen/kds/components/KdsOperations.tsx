import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { RecipeModal } from './RecipeModal'
import { useKds } from '../hooks/useKds'
import { matches, clock } from '../utils/format'
import { kdsApi, kdsError, kdsReadPolicy, kdsPollInterval } from '../api/kdsApi'

type KdsOperationsProps = {
  now?: number
  focus?: boolean
  onToggleFocus?: () => void
  area?: string
  lateCount?: number
}

export function KdsOperations({
  now,
  focus,
  onToggleFocus,
  lateCount = 0,
}: KdsOperationsProps = {}) {
  const { tasks, items, summary, batches, run, pending, stationId } = useKds()
  const [showBatchModal, setShowBatchModal] = useState(false)
  const [showFireModal, setShowFireModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [showMenuModal, setShowMenuModal] = useState(false)

  // State cho Dish Action Modal
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [priorityInput, setPriorityInput] = useState('0')
  const [remakeReason, setRemakeReason] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  // State cho Fire Course
  const [fireCourse, setFireCourse] = useState('Tráng miệng')
  const [fireTargetTask, setFireTargetTask] = useState<{ sessionId: string; orderId?: string }>()

  // State cho Menu Modal (Báo hết món & Kho nguyên liệu)
  const [menuModalTab, setMenuModalTab] = useState<'dishes' | 'ingredients'>('dishes')
  const [menuQuery, setMenuQuery] = useState('')
  const [menuFilter, setMenuFilter] = useState<'all' | 'available' | 'outOfStock'>('all')
  const [ingredientQuery, setIngredientQuery] = useState('')
  const [ingredientFilter, setIngredientFilter] = useState<'all' | 'zero' | 'low' | 'ok'>('all')

  // State cho Recipe Modal của Option & Món tra cứu trực tiếp
  const [optionRecipe, setOptionRecipe] = useState<{ id: string; name: string }>()
  const [inspectRecipeDish, setInspectRecipeDish] = useState<{
    id: string
    name: string
    image: string
  } | null>(null)

  const selectedTask = tasks.find((t) => t.kitchenTaskId === selectedTaskId)
  const detail = useQuery({
    ...kdsReadPolicy,
    queryKey: ['kitchen-live', 'detail', stationId, selectedTaskId],
    queryFn: ({ signal }) => kdsApi.task(selectedTaskId, signal),
    enabled: !!selectedTask,
    refetchInterval: kdsPollInterval(5000),
  })
  const task = selectedTask ? detail.data || selectedTask : undefined

  // Lọc danh sách món hiển thị trong modal chọn
  const selectableTasks = tasks.filter(
    (t) => showHistory || !['Served', 'Cancelled'].includes(t.status),
  )

  // Danh sách các món đang nấu để có thể hoàn thành mẻ
  const cookingItemIds = [
    ...new Set(tasks.filter((t) => t.status === 'Cooking').map((t) => t.itemId)),
  ]

  // Số lượng món đang Hold
  const holdTasks = tasks.filter((t) => t.status === 'Hold')

  // Tồn kho nguyên liệu bếp thời gian thực
  const ingredientsQuery = useQuery({
    ...kdsReadPolicy,
    queryKey: ['kitchen-live', 'ingredients'],
    queryFn: ({ signal }) => kdsApi.ingredients(signal),
    staleTime: 20000,
    refetchInterval: kdsPollInterval(20000),
  })
  const allIngredients = ingredientsQuery.data || []
  const zeroStockIngredients = allIngredients.filter((i) => i.stockQuantity <= 0)
  const lowStockIngredients = allIngredients.filter(
    (i) => i.stockQuantity > 0 && (i.isLowStock || i.stockQuantity <= i.lowStockThreshold),
  )
  const okIngredients = allIngredients.filter(
    (i) => i.stockQuantity > i.lowStockThreshold && !i.isLowStock,
  )

  // Số lượng món hết
  const outOfStockCount = items.filter((i) => i.availability === 'OutOfStock').length

  // Danh sách món lọc cho Menu Modal
  const filteredMenuItems = items.filter((item) => {
    const matchQuery = !menuQuery.trim() || matches(item.itemName, menuQuery)
    const matchFilter =
      menuFilter === 'all' ||
      (menuFilter === 'available' && item.availability === 'Available') ||
      (menuFilter === 'outOfStock' && item.availability === 'OutOfStock')
    return matchQuery && matchFilter
  })

  // Danh sách nguyên liệu lọc cho Tab Kho
  const filteredIngredients = allIngredients.filter((ing) => {
    const matchQuery =
      !ingredientQuery.trim() ||
      matches(ing.ingredientName, ingredientQuery) ||
      matches(ing.ingredientCode, ingredientQuery)
    const matchFilter =
      ingredientFilter === 'all' ||
      (ingredientFilter === 'zero' && ing.stockQuantity <= 0) ||
      (ingredientFilter === 'low' &&
        ing.stockQuantity > 0 &&
        (ing.isLowStock || ing.stockQuantity <= ing.lowStockThreshold)) ||
      (ingredientFilter === 'ok' &&
        ing.stockQuantity > ing.lowStockThreshold &&
        !ing.isLowStock)
    return matchQuery && matchFilter
  })

  return (
    <>
      {/* Quick Action Toolbar - Tinh gọn, hợp nhất đồng hồ và nút toàn màn hình */}
      <section
        aria-label="Điều phối bếp tiện gọn"
        className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 shadow-2xs"
      >
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Đồng hồ và Trạng thái hàng chờ */}
          {now !== undefined && (
            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-2 sm:mr-1">
              <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-black tabular-nums text-slate-800">
                <Icon name="clock" size={13} className="text-emerald-700" />
                {clock(now)}
              </span>

              {lateCount > 0 ? (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-800">
                  <span className="size-1.5 rounded-full bg-rose-600 animate-pulse" />
                  {lateCount} trễ
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                  <span className="size-1.5 rounded-full bg-emerald-600" />
                  Ổn định
                </span>
              )}
            </div>
          )}

          {/* Nút Tình trạng thực đơn & Kho nguyên liệu (Nổi bật nhất, vị trí đầu tiên) */}
          <button
            type="button"
            onClick={() => setShowMenuModal(true)}
            className={`inline-flex min-h-8 items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold transition-all active:scale-[0.98] ${
              outOfStockCount > 0 || zeroStockIngredients.length > 0
                ? 'border-amber-300 bg-amber-50 text-amber-900 shadow-xs hover:bg-amber-100'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Icon
              name="store"
              size={15}
              className={
                outOfStockCount > 0 || zeroStockIngredients.length > 0
                  ? 'text-amber-700'
                  : 'text-slate-500'
              }
            />
            <span>Thực đơn & Kho</span>
            {outOfStockCount > 0 && (
              <span className="flex items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-extrabold text-white">
                Hết {outOfStockCount}
              </span>
            )}
            {zeroStockIngredients.length > 0 && (
              <span className="flex items-center justify-center rounded-full border border-rose-300 bg-rose-100 px-1.5 py-0.5 text-[10px] font-extrabold text-rose-800">
                ⚠️ {zeroStockIngredients.length} NL cạn
              </span>
            )}
          </button>

          {/* Nút Nấu theo mẻ */}
          <button
            type="button"
            onClick={() => setShowBatchModal(true)}
            className="inline-flex min-h-8 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-1 text-xs font-bold text-emerald-900 transition-all hover:bg-emerald-100 hover:shadow-xs active:scale-[0.98]"
          >
            <Icon name="grid" size={15} className="text-emerald-700" />
            <span>Nấu theo mẻ</span>
            {batches.length > 0 && (
              <span className="flex size-4.5 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-extrabold text-white">
                {batches.length}
              </span>
            )}
          </button>

          {/* Nút Lên món theo đợt (Fire Course) */}
          <button
            type="button"
            onClick={() => {
              if (holdTasks.length > 0) {
                const firstHold = holdTasks[0]
                if (firstHold.tableSessionId) {
                  setFireTargetTask({
                    sessionId: firstHold.tableSessionId,
                    orderId: firstHold.orderId,
                  })
                }
              }
              setShowFireModal(true)
            }}
            className={`inline-flex min-h-8 items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold transition-all active:scale-[0.98] ${
              holdTasks.length > 0
                ? 'border-violet-300 bg-violet-50 text-violet-900 shadow-xs hover:bg-violet-100'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon
              name="fire"
              size={15}
              className={holdTasks.length > 0 ? 'text-violet-600' : 'text-slate-400'}
            />
            <span>Lên đợt món</span>
            {holdTasks.length > 0 && (
              <span className="flex size-4.5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-extrabold text-white">
                {holdTasks.length}
              </span>
            )}
          </button>

          {/* Nút Xử lý & Làm lại món */}
          <button
            type="button"
            onClick={() => setShowActionModal(true)}
            className="inline-flex min-h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
          >
            <Icon name="settings" size={15} className="text-slate-500" />
            <span>Ưu tiên & Làm lại</span>
          </button>
        </div>

        {/* Khối bên phải: Nấu TB & Nút Toàn màn hình */}
        <div className="flex items-center gap-2">
          {summary && (
            <span className="hidden lg:flex items-center gap-1 rounded-lg bg-slate-100/80 px-2 py-1 text-[11px] font-medium text-slate-700">
              <Icon name="clock" size={13} className="text-slate-500" />
              Nấu TB: <strong className="text-slate-900">{summary.avgCookingTimeMinutes.toFixed(1)}p</strong>
            </span>
          )}

          {onToggleFocus && (
            <button
              type="button"
              onClick={onToggleFocus}
              aria-pressed={focus}
              className={`flex min-h-8 items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold transition-all active:scale-95 ${
                focus
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon name={focus ? 'close' : 'monitor'} size={14} />
              <span>{focus ? 'Thoát toàn màn hình' : 'Toàn màn hình'}</span>
            </button>
          )}
        </div>
      </section>

      {/* Modal 1: Nấu theo mẻ (Batch Cooking Modal) */}
      {showBatchModal && (
        <Modal
          title="Điều phối nấu theo mẻ"
          subtitle={`Gom ${batches.length} nhóm món giống nhau từ các bàn để chế biến cùng lúc`}
          size="wide"
          onClose={() => setShowBatchModal(false)}
        >
          <div className="space-y-6 p-6">
            {/* Nhóm món đang chờ nấu */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                <span className="flex size-2 rounded-full bg-amber-500" />
                Mẻ món đang chờ bắt đầu ({batches.length} mẻ)
              </h3>
              {batches.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                  Hiện không có món nào cùng loại đủ điều kiện gom mẻ.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {batches.map((batch) => (
                    <div
                      key={`${batch.kitchenStationId}-${batch.itemId}`}
                      className="flex flex-col justify-between rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 transition-all hover:border-amber-300"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-base font-bold text-slate-900">
                            {batch.itemName}
                          </h4>
                          <span className="inline-flex items-center rounded-lg bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-900">
                            {batch.totalQuantity} phần
                          </span>
                        </div>
                        <ul className="mt-2.5 space-y-1 text-xs text-slate-600">
                          {batch.tasks.map((t) => (
                            <li key={t.kitchenTaskId} className="flex items-center justify-between">
                              <span className="font-semibold text-slate-700">
                                {t.orderNumber}
                              </span>
                              <span>
                                {t.quantity} phần {t.note && `(${t.note})`}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        type="button"
                        disabled={pending || !batch.tasks.length}
                        onClick={async () => {
                          await run({
                            type: 'batch',
                            action: 'start',
                            taskIds: batch.tasks.map((t) => t.kitchenTaskId),
                          })
                        }}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-amber-700 disabled:opacity-50"
                      >
                        <Icon name="fire" size={16} />
                        Bắt đầu nấu cả mẻ ({batch.totalQuantity} phần)
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Nhóm món đang nấu dở có thể hoàn thành mẻ */}
            {cookingItemIds.length > 0 && (
              <div className="border-t border-slate-100 pt-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                  <span className="flex size-2 rounded-full bg-sky-500" />
                  Món đang chế biến ({cookingItemIds.length} nhóm)
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {cookingItemIds.map((id) => {
                    const lines = tasks.filter((t) => t.itemId === id && t.status === 'Cooking')
                    const totalQty = lines.reduce((n, t) => n + t.quantity, 0)
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between rounded-xl border border-sky-200/80 bg-sky-50/40 p-4"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{lines[0]?.nameSnapshot}</p>
                          <p className="text-xs text-sky-800 font-medium">
                            {totalQty} phần đang nấu ({lines.length} đơn)
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={async () => {
                            await run({
                              type: 'batch',
                              action: 'complete',
                              taskIds: lines.map((t) => t.kitchenTaskId),
                            })
                          }}
                          className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-sky-700 disabled:opacity-50"
                        >
                          <Icon name="check" size={15} />
                          Xong cả mẻ
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal 2: Lên món theo đợt (Fire Course Modal) */}
      {showFireModal && (
        <Modal
          title="Lên món theo đợt (Fire Course)"
          subtitle="Kích hoạt chuyển các món đang ở trạng thái Tạm hoãn (Hold) sang Chờ nấu"
          onClose={() => setShowFireModal(false)}
        >
          <div className="space-y-4 p-6">
            <div>
              <label className="block text-xs font-bold text-slate-700">Tên đợt phục vụ</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {['Món chính', 'Tráng miệng', 'Đồ uống'].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setFireCourse(name)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                      fireCourse === name
                        ? 'bg-violet-700 text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <input
                aria-label="Tên đợt phục vụ tùy chỉnh"
                className="mt-2.5 w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                value={fireCourse}
                onChange={(e) => setFireCourse(e.target.value)}
                placeholder="Nhập tên đợt món (ví dụ: Tráng miệng, Trái cây...)"
              />
            </div>

            {holdTasks.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
                Hiện không có món nào đang ở trạng thái tạm hoãn (Hold).
              </p>
            ) : (
              <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-3 text-xs text-violet-900">
                Có <strong>{holdTasks.length} món</strong> đang ở trạng thái tạm hoãn sẵn sàng được kích hoạt.
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowFireModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                type="button"
                disabled={pending || !fireCourse.trim() || holdTasks.length === 0}
                onClick={async () => {
                  const targetSession = fireTargetTask?.sessionId || holdTasks[0]?.tableSessionId
                  const targetOrderId = fireTargetTask?.orderId || holdTasks[0]?.orderId || ''
                  if (targetSession) {
                    const success = await run({
                      type: 'fire',
                      tableSessionId: targetSession,
                      orderId: targetOrderId,
                      course: fireCourse.trim(),
                    })
                    if (success) {
                      setShowFireModal(false)
                    }
                  }
                }}
                className="flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-violet-800 disabled:opacity-50"
              >
                <Icon name="fire" size={16} />
                Kích hoạt lên món ngay
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 3: Xử lý món & Làm lại (Dish Remake & Priority) */}
      {showActionModal && (
        <Modal
          title="Ưu tiên & Làm lại món"
          subtitle="Điều chỉnh độ ưu tiên hàng đợi hoặc tạo lệnh làm lại món sự cố"
          size="wide"
          onClose={() => {
            setShowActionModal(false)
            setSelectedTaskId('')
            setRemakeReason('')
          }}
        >
          <div className="space-y-5 p-6">
            {/* Chọn món cần xử lý */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Chọn món trong trạm:</label>
                <label className="flex items-center gap-1.5 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={showHistory}
                    onChange={(e) => setShowHistory(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  Hiện cả món đã phục vụ/đã hủy
                </label>
              </div>

              <select
                aria-label="Chọn món cần xử lý"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                value={selectedTaskId}
                onChange={(e) => {
                  setSelectedTaskId(e.target.value)
                  setRemakeReason('')
                  setPriorityInput(
                    String(tasks.find((t) => t.kitchenTaskId === e.target.value)?.priority || 0),
                  )
                }}
              >
                <option value="">-- Bấm để chọn món cần xử lý --</option>
                {selectableTasks.map((t) => (
                  <option key={t.kitchenTaskId} value={t.kitchenTaskId}>
                    {t.orderNumber} · {t.nameSnapshot} × {t.quantity} [{t.status}]
                  </option>
                ))}
              </select>
            </div>

            {detail.isLoading && selectedTaskId && (
              <p className="text-xs text-slate-500">Đang tải chi tiết món…</p>
            )}
            {detail.isError && selectedTaskId && (
              <p className="text-xs text-rose-600">{kdsError(detail.error)}</p>
            )}

            {task && (
              <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-base font-bold text-slate-900">
                    {task.orderNumber} · {task.nameSnapshot} × {task.quantity}
                  </h4>
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    Trạng thái: {task.status}
                  </span>
                </div>

                <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                  <p>Trạm: <strong>{task.kitchenStationName}</strong></p>
                  <p>Kênh: <strong>{task.channel || 'DineIn'}</strong></p>
                  <p>Mức ưu tiên hiện tại: <strong>{task.priority}</strong></p>
                  <p>Ghi chú: <strong className="text-amber-800">{task.note || 'Không có'}</strong></p>
                </div>

                {/* Danh sách Options */}
                {task.options && task.options.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-xs font-semibold text-slate-500">Topping/Option:</span>
                    {task.options.map((opt, idx) => (
                      <button
                        key={`${opt.optionId}-${idx}`}
                        type="button"
                        onClick={() => setOptionRecipe({ id: opt.optionId, name: opt.name })}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                      >
                        {opt.quantity} × {opt.name} (Xem CT)
                      </button>
                    ))}
                  </div>
                )}

                {/* Khối 1: Đổi mức ưu tiên */}
                <div className="border-t border-slate-200/80 pt-3">
                  <label className="block text-xs font-bold text-slate-700">Điều chỉnh mức ưu tiên:</label>
                  <div className="mt-2 flex items-center gap-2">
                    {[
                      { label: 'Thường (0)', val: 0 },
                      { label: 'Ưu tiên (10)', val: 10 },
                      { label: 'Khẩn cấp (50)', val: 50 },
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => setPriorityInput(String(p.val))}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                          Number(priorityInput) === p.val
                            ? 'bg-slate-800 text-white'
                            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                    <input
                      type="number"
                      min="0"
                      className="w-20 rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-center font-bold outline-none focus:border-emerald-500"
                      value={priorityInput}
                      onChange={(e) => setPriorityInput(e.target.value)}
                    />
                    <button
                      type="button"
                      disabled={pending || !priorityInput.trim()}
                      onClick={async () => {
                        await run({
                          type: 'priority',
                          id: task.kitchenTaskId,
                          priority: Number(priorityInput),
                        })
                      }}
                      className="rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
                    >
                      Lưu ưu tiên
                    </button>
                  </div>
                </div>

                {/* Khối 2: Làm lại món (Remake) */}
                {task.channel !== 'Takeaway' && (
                  <div className="border-t border-slate-200/80 pt-3">
                    <label className="block text-xs font-bold text-rose-800">
                      Làm lại món do sự cố bếp:
                    </label>
                    <form
                      className="mt-2 flex gap-2"
                      onSubmit={async (e) => {
                        e.preventDefault()
                        if (remakeReason.trim()) {
                          const ok = await run({
                            type: 'remake',
                            id: task.kitchenTaskId,
                            reason: remakeReason.trim(),
                          })
                          if (ok) {
                            setSelectedTaskId('')
                            setRemakeReason('')
                            setShowActionModal(false)
                          }
                        }
                      }}
                    >
                      <input
                        required
                        placeholder="Nhập lý do làm lại món (ví dụ: Cháy món, khách đổi ý, sai định lượng...)"
                        className="flex-1 rounded-xl border border-rose-200 bg-white p-2.5 text-xs text-slate-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                        value={remakeReason}
                        onChange={(e) => setRemakeReason(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={pending || !remakeReason.trim()}
                        className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50"
                      >
                        <Icon name="refresh" size={14} />
                        Làm lại ngay
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal 4: Tình trạng thực đơn & Kho nguyên liệu */}
      {showMenuModal && (
        <Modal
          title="Quản lý Thực đơn & Kho nguyên liệu"
          subtitle="Theo dõi định lượng tồn kho thực tế, kiểm tra công thức và kịp thời báo hết món"
          size="wide"
          onClose={() => setShowMenuModal(false)}
        >
          <div className="space-y-4 p-5 sm:p-6">
            {/* Header chuyển Tab: Món ăn vs Kho nguyên liệu */}
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setMenuModalTab('dishes')}
                className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
                  menuModalTab === 'dishes'
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon name="store" size={15} />
                <span>Thực đơn món ({items.length})</span>
                {outOfStockCount > 0 && (
                  <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                    Hết {outOfStockCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMenuModalTab('ingredients')}
                className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
                  menuModalTab === 'ingredients'
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon name="grid" size={15} />
                <span>Tồn kho nguyên liệu ({allIngredients.length})</span>
                {zeroStockIngredients.length > 0 ? (
                  <span className="rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white animate-pulse">
                    Cạn {zeroStockIngredients.length}
                  </span>
                ) : lowStockIngredients.length > 0 ? (
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                    Sắp hết {lowStockIngredients.length}
                  </span>
                ) : null}
              </button>
            </div>

            {/* TAB 1: DANH SÁCH MÓN ĂN */}
            {menuModalTab === 'dishes' && (
              <div className="space-y-3.5">
                {/* Thông báo nếu có nguyên liệu trong kho bị cạn */}
                {zeroStockIngredients.length > 0 && (
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-900">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon name="close" size={16} className="text-rose-600 shrink-0" />
                      <p className="truncate">
                        Kho có <strong>{zeroStockIngredients.length} nguyên liệu</strong> cạn tồn kho:{' '}
                        {zeroStockIngredients.map((i) => i.ingredientName).slice(0, 3).join(', ')}
                        {zeroStockIngredients.length > 3 ? '...' : ''}.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMenuModalTab('ingredients')}
                      className="shrink-0 rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-rose-700"
                    >
                      Kiểm tra kho NL
                    </button>
                  </div>
                )}

                {/* Thanh tìm kiếm và bộ lọc trạng thái */}
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Icon
                      name="search"
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      placeholder="Tìm tên món…"
                      value={menuQuery}
                      onChange={(e) => setMenuQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setMenuFilter('all')}
                      className={`rounded-lg px-2.5 py-1.5 transition-all ${
                        menuFilter === 'all'
                          ? 'bg-white font-bold text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tất cả ({items.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMenuFilter('available')}
                      className={`rounded-lg px-2.5 py-1.5 transition-all ${
                        menuFilter === 'available'
                          ? 'bg-white font-bold text-emerald-800 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Đang bán ({items.filter((i) => i.availability === 'Available').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMenuFilter('outOfStock')}
                      className={`rounded-lg px-2.5 py-1.5 transition-all ${
                        menuFilter === 'outOfStock'
                          ? 'bg-white font-bold text-rose-800 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tạm hết ({outOfStockCount})
                    </button>
                  </div>
                </div>

                {/* Danh sách món ăn */}
                <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
                  {filteredMenuItems.map((item) => {
                    const isOutOfStock = item.availability === 'OutOfStock'
                    return (
                      <div
                        key={item.itemId}
                        className={`flex flex-col gap-2.5 rounded-2xl border p-3.5 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                          isOutOfStock
                            ? 'border-rose-200 bg-rose-50/40'
                            : 'border-slate-200/80 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-bold text-slate-900">
                              {item.itemName}
                            </strong>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                isOutOfStock
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${
                                  isOutOfStock ? 'bg-rose-600' : 'bg-emerald-600'
                                }`}
                              />
                              {isOutOfStock ? 'Tạm hết món' : 'Đang phục vụ'}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {isOutOfStock
                              ? 'Đã ngưng nhận đặt món này. Bấm "Mở bán lại" khi đã bổ sung nguyên liệu.'
                              : 'Khách hàng và nhân viên có thể gọi món này bình thường.'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {/* Nút xem công thức & kiểm tra định lượng nguyên liệu món này */}
                          <button
                            type="button"
                            onClick={() =>
                              setInspectRecipeDish({
                                id: item.itemId,
                                name: item.itemName,
                                image: item.imageUrl || '',
                              })
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:border-slate-300 hover:bg-slate-50"
                            title="Kiểm tra tồn kho các nguyên liệu của món này"
                          >
                            <Icon name="document" size={14} className="text-slate-500" />
                            <span>Định lượng & Kho</span>
                          </button>

                          {/* Nút Báo hết / Mở bán lại */}
                          {isOutOfStock ? (
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() =>
                                void run({
                                  type: 'availability',
                                  id: item.itemId,
                                  availability: 'Available',
                                })
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 shadow-2xs transition-all hover:bg-emerald-100 active:scale-95 disabled:opacity-50"
                            >
                              <Icon name="check" size={14} className="text-emerald-600" />
                              Mở bán lại
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() =>
                                void run({
                                  type: 'availability',
                                  id: item.itemId,
                                  availability: 'OutOfStock',
                                })
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 shadow-2xs transition-all hover:bg-rose-100 active:scale-95 disabled:opacity-50"
                            >
                              <Icon name="close" size={13} className="text-rose-600" />
                              Báo hết món
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {!filteredMenuItems.length && (
                    <div className="py-12 text-center text-slate-500">
                      <Icon name="store" size={28} className="mx-auto text-slate-300" />
                      <p className="mt-2 text-sm font-medium">Không tìm thấy món ăn phù hợp</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: TỒN KHO NGUYÊN LIỆU BẾP */}
            {menuModalTab === 'ingredients' && (
              <div className="space-y-3.5">
                {/* Thanh tìm kiếm và bộ lọc tình trạng tồn kho */}
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Icon
                      name="search"
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      placeholder="Tìm mã hoặc tên nguyên liệu…"
                      value={ingredientQuery}
                      onChange={(e) => setIngredientQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setIngredientFilter('all')}
                      className={`rounded-lg px-2.5 py-1.5 transition-all ${
                        ingredientFilter === 'all'
                          ? 'bg-white font-bold text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tất cả ({allIngredients.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setIngredientFilter('zero')}
                      className={`rounded-lg px-2.5 py-1.5 transition-all ${
                        ingredientFilter === 'zero'
                          ? 'bg-white font-bold text-rose-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🔴 Cạn kho ({zeroStockIngredients.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setIngredientFilter('low')}
                      className={`rounded-lg px-2.5 py-1.5 transition-all ${
                        ingredientFilter === 'low'
                          ? 'bg-white font-bold text-amber-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🟠 Sắp hết ({lowStockIngredients.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setIngredientFilter('ok')}
                      className={`rounded-lg px-2.5 py-1.5 transition-all ${
                        ingredientFilter === 'ok'
                          ? 'bg-white font-bold text-emerald-800 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🟢 Đủ tồn ({okIngredients.length})
                    </button>
                  </div>
                </div>

                {/* Thông báo trạng thái tải / lỗi kho nguyên liệu */}
                {ingredientsQuery.isLoading && (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 p-6 text-xs text-slate-600">
                    <Icon name="refresh" size={16} className="animate-spin text-emerald-600" />
                    <span>Đang tải thông tin tồn kho nguyên liệu thời gian thực…</span>
                  </div>
                )}

                {ingredientsQuery.isError && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <Icon name="close" size={16} className="mt-0.5 shrink-0 text-rose-600" />
                        <div>
                          <p className="font-bold text-rose-800">Không thể tải dữ liệu tồn kho:</p>
                          <p className="mt-0.5 text-rose-700">{kdsError(ingredientsQuery.error)}</p>
                          <p className="mt-1 text-[11px] text-slate-600">
                            (Gợi ý: Cần quyền tài khoản Bếp/Quản lý hoặc khởi động Inventory Service).
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => void ingredientsQuery.refetch()}
                        className="shrink-0 rounded-lg bg-rose-600 px-3 py-1.5 font-bold text-white hover:bg-rose-700 active:scale-95 transition-all"
                      >
                        Thử lại
                      </button>
                    </div>
                  </div>
                )}

                {/* Bảng chi tiết tồn kho nguyên liệu */}
                <div className="max-h-[50vh] overflow-y-auto overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 z-10">
                      <tr>
                        <th className="py-2.5 px-3.5">Nguyên liệu</th>
                        <th className="py-2.5 px-3">Tồn kho hiện tại</th>
                        <th className="py-2.5 px-3">Mức tối thiểu</th>
                        <th className="py-2.5 px-3">Thước đo tồn</th>
                        <th className="py-2.5 px-3 text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredIngredients.map((ing) => {
                        const isZero = ing.stockQuantity <= 0
                        const isLow =
                          !isZero && (ing.isLowStock || ing.stockQuantity <= ing.lowStockThreshold)
                        const safeThreshold = Math.max(1, ing.lowStockThreshold * 2)
                        const percent = Math.min(
                          100,
                          Math.max(0, Math.round((ing.stockQuantity / safeThreshold) * 100)),
                        )

                        return (
                          <tr
                            key={ing.ingredientId}
                            className={`transition-colors ${
                              isZero
                                ? 'bg-rose-50/60'
                                : isLow
                                  ? 'bg-amber-50/50'
                                  : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-2.5 px-3.5">
                              <p className="font-bold text-slate-900">{ing.ingredientName}</p>
                              <p className="text-[11px] font-mono text-slate-400">
                                {ing.ingredientCode}
                              </p>
                            </td>
                            <td className="py-2.5 px-3 font-extrabold tabular-nums">
                              <span
                                className={
                                  isZero
                                    ? 'text-rose-700'
                                    : isLow
                                      ? 'text-amber-700'
                                      : 'text-slate-800'
                                }
                              >
                                {ing.stockQuantity} {ing.baseUnit}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 font-medium">
                              {ing.lowStockThreshold} {ing.baseUnit}
                            </td>
                            <td className="py-2.5 px-3 w-32">
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
                                <div
                                  className={`h-full rounded-full ${
                                    isZero
                                      ? 'bg-rose-500'
                                      : isLow
                                        ? 'bg-amber-500'
                                        : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {isZero ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-extrabold text-rose-800">
                                  🔴 Cạn kho
                                </span>
                              ) : isLow ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                                  🟠 Sắp hết
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                                  🟢 Đủ tồn
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  {!filteredIngredients.length && !ingredientsQuery.isLoading && !ingredientsQuery.isError && (
                    <div className="py-10 text-center text-slate-500">
                      <Icon name="grid" size={24} className="mx-auto text-slate-300" />
                      <p className="mt-2 text-xs font-medium">
                        {allIngredients.length === 0
                          ? 'Kho hiện chưa có nguyên liệu nào được khởi tạo.'
                          : 'Không có nguyên liệu nào khớp với bộ lọc hiện tại.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal tra cứu công thức & tồn kho nguyên liệu định lượng từ Menu */}
      {inspectRecipeDish && (
        <RecipeModal
          dish={inspectRecipeDish}
          onClose={() => setInspectRecipeDish(null)}
        />
      )}

      {/* Modal Recipe của Option */}
      {optionRecipe && (
        <RecipeModal
          dish={{ id: optionRecipe.id, name: optionRecipe.name, image: '' }}
          option
          onClose={() => setOptionRecipe(undefined)}
        />
      )}
    </>
  )
}
