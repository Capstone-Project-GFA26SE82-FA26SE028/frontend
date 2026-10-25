import { Icon } from '../../../components/Icon/Icon'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Modal } from '../../../components/Modal/Modal'
import {
  kitchenApi,
  kitchenError,
  type KitchenStatus,
  type KitchenTask,
} from '../api/kitchenApi'

const columns: {
  status: KitchenStatus
  label: string
  color: string
  dot: string
  icon: string
}[] = [
  {
    status: 'Pending',
    label: 'Pending',
    icon: 'clock',
    color: 'bg-amber-50 text-amber-900',
    dot: 'bg-amber-500',
  },
  {
    status: 'Cooking',
    label: 'Cooking',
    icon: 'fire',
    color: 'bg-blue-50 text-blue-900',
    dot: 'bg-blue-500',
  },
  {
    status: 'Ready',
    label: 'Ready',
    icon: 'service',
    color: 'bg-emerald-50 text-emerald-900',
    dot: 'bg-emerald-500',
  },
]
function minutes(value: string, now: number) {
  return Math.max(0, Math.floor((now - Date.parse(value)) / 60000))
}
function late(task: KitchenTask, now: number) {
  return (
    task.status === 'Cooking' && !!task.dueAt && Date.parse(task.dueAt) < now
  )
}
function time(value?: string | null) {
  return value
    ? new Date(value).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'
}

export function KitchenPage() {
  const [station, setStation] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now)
  const client = useQueryClient()
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const stations = useQuery({
    queryKey: ['kitchen', 'stations'],
    queryFn: ({ signal }) => kitchenApi.stations(signal),
    refetchInterval: 30000,
  })
  const summary = useQuery({
    queryKey: ['kitchen', 'summary', station],
    queryFn: ({ signal }) => kitchenApi.summary(station, signal),
    refetchInterval: 5000,
  })
  const refresh = () => client.invalidateQueries({ queryKey: ['kitchen'] })
  const mutation = useMutation({
    mutationFn: ({
      task,
      action,
      value,
    }: {
      task: KitchenTask
      action: 'status' | 'priority'
      value: string | number
    }) => kitchenApi.update(task, action, value),
    onSuccess: () => {
      toast.success('Item updated successfully.')
      return refresh()
    },
    onError: (error) => {
      toast.error(kitchenError(error))
      return refresh()
    },
  })
  const update = (
    task: KitchenTask,
    action: 'status' | 'priority',
    value: string | number,
  ) => mutation.mutate({ task, action, value })
  const metrics = [
    {
      label: 'Pending',
      icon: 'clock',
      value: summary.data?.pendingCount,
      color: 'text-amber-700',
    },
    {
      label: 'Cooking',
      icon: 'fire',
      value: summary.data?.cookingCount,
      color: 'text-blue-700',
    },
    {
      label: 'Awaiting service',
      icon: 'service',
      value: summary.data?.readyCount,
      color: 'text-brand',
    },
    {
      label: 'Average cooking time',
      icon: 'chart',
      value: summary.data
        ? `${summary.data.avgCookingTimeMinutes} min`
        : undefined,
      color: 'text-ink',
    },
  ]
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">KITCHEN OPERATIONS</p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#102c30] sm:text-3xl">
            Kitchen Display System
          </h1>
          <p className="mt-2 text-sm text-muted">
            Track orders and update preparation progress at your station.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold">
            Kitchen station
            <select
              value={station}
              onChange={(event) => setStation(event.target.value)}
              className="field mt-1 min-w-52"
              disabled={stations.isPending || stations.isError}
            >
              <option value="">All stations</option>
              {stations.data?.map((item) => (
                <option
                  key={item.kitchenStationId}
                  value={item.kitchenStationId}
                >
                  {item.kitchenStationName} ({item.kitchenStationCode})
                </option>
              ))}
            </select>
          </label>
          <button
            className="mt-5 inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-emerald-50"
            onClick={() => void refresh()}
          >
            <Icon name="activity" size={16} />
            Refresh
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            className="flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-[0_2px_12px_#173b2c03] sm:flex-row sm:p-5"
            key={metric.label}
          >
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 ${metric.color}`}
            >
              <Icon name={metric.icon} size={23} />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-muted">{metric.label}</p>
              <p className={`mt-2 text-3xl font-bold ${metric.color}`}>
                {metric.value ?? '—'}
              </p>
            </div>
          </div>
        ))}
      </div>
      {(stations.isError || summary.isError) && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {kitchenError(stations.error || summary.error)}{' '}
          <button className="underline" onClick={() => void refresh()}>
            Try again
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>Highest priority first · Oldest queued first</span>
        <span role="status">
          {summary.isError
            ? 'Unable to sync summary'
            : summary.isFetching
              ? 'Syncing…'
              : `Updated ${time(summary.dataUpdatedAt ? new Date(summary.dataUpdatedAt).toISOString() : null)}`}{' '}
          · Refreshes every 5 seconds
        </span>
      </div>
      <div className="grid items-start gap-5 xl:grid-cols-3">
        {columns.map((column) => (
          <TaskColumn
            key={`${station}-${column.status}`}
            {...column}
            station={station}
            now={now}
            pending={mutation.isPending}
            onSelect={setSelected}
            update={update}
          />
        ))}
      </div>
      {selected && (
        <TaskDetails id={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

type ColumnProps = (typeof columns)[number] & {
  station: string
  now: number
  pending: boolean
  onSelect: (id: string) => void
  update: (
    task: KitchenTask,
    action: 'status' | 'priority',
    value: string | number,
  ) => void
}
function TaskColumn({
  status,
  label,
  color,
  dot,
  icon,
  station,
  now,
  pending,
  onSelect,
  update,
}: ColumnProps) {
  const [page, setPage] = useState(1)
  const [confirmation, setConfirmation] = useState<KitchenTask | null>(null)
  const tasks = useQuery({
    queryKey: ['kitchen', 'tasks', station, status, page],
    queryFn: ({ signal }) => kitchenApi.tasks(station, status, page, signal),
    refetchInterval: 5000,
  })
  const pages = Math.max(1, Math.ceil((tasks.data?.totalCount ?? 0) / 30))
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/70 bg-white/60 p-3">
      <header
        className={`mb-3 flex items-center gap-2 rounded-xl px-4 py-3 ${color}`}
      >
        <Icon name={icon} size={18} />
        <span className={`size-1.5 rounded-full ${dot}`} />
        <h2 className="text-sm font-bold">{label}</h2>
        <span className="ml-auto rounded-lg bg-white/80 px-2 py-1 text-sm font-bold">
          {tasks.data?.totalCount ?? '—'}
        </span>
      </header>
      {tasks.isPending && (
        <p role="status" className="p-6 text-center text-sm text-muted">
          Loading items…
        </p>
      )}
      {tasks.isError && (
        <div
          role="alert"
          className="mb-3 rounded-xl bg-red-50 p-4 text-sm text-red-800"
        >
          {kitchenError(tasks.error)}
          <button
            className="mt-2 block underline"
            onClick={() => void tasks.refetch()}
          >
            Try again
          </button>
        </div>
      )}
      {tasks.data?.items.length === 0 && (
        <div className="rounded-xl border border-dashed border-stone-300 px-4 py-12 text-center">
          <p className="font-semibold">
            {page > 1 ? 'No items left on this page' : 'No items yet'}
          </p>
          <p className="mt-1 text-sm text-muted">
            {page > 1
              ? 'Go back to the previous page to view items.'
              : 'New items will appear when sent to the kitchen.'}
          </p>
        </div>
      )}
      <div className="space-y-3">
        {tasks.data?.items.map((task) => (
          <article
            key={task.kitchenTaskId}
            className={`rounded-xl border bg-white p-4 shadow-sm ${late(task, now) ? 'border-red-400' : 'border-stone-200'}`}
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-bold text-brand">
                #{task.orderNumber || 'No order number'}
              </span>
              <span className="rounded-md bg-stone-100 px-2 py-1 text-muted">
                {task.kitchenStationName}
              </span>
            </div>
            <button
              onClick={() => onSelect(task.kitchenTaskId)}
              className="mt-3 block w-full text-left text-lg font-bold hover:text-brand"
            >
              <span className="mr-2 text-brand">{task.quantity}×</span>
              {task.nameSnapshot}
            </button>
            {task.options?.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {task.options.map((option) => (
                  <li key={option.optionId}>
                    + {option.name} × {option.quantity}
                  </li>
                ))}
              </ul>
            )}
            {task.note && (
              <p className="mt-3 whitespace-pre-wrap rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                {task.note}
              </p>
            )}
            <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted">
              <span>
                {status === 'Cooking' && task.cookingAt
                  ? `Cooking for ${minutes(task.cookingAt, now)} min`
                  : status === 'Ready' && task.readyAt
                    ? `Ready at ${time(task.readyAt)}`
                    : `Waiting for ${minutes(task.queuedAt, now)} min`}
              </span>
              <span>Priority {task.priority}</span>
            </div>
            {task.estimatedMinutes != null && (
              <p className="mt-2 text-xs text-muted">
                Estimated {task.estimatedMinutes} min
                {task.dueAt ? ` · Due ${time(task.dueAt)}` : ''}
              </p>
            )}
            {late(task, now) && (
              <p className="mt-2 text-sm font-semibold text-red-700">
                Over the estimated cooking time
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-100 pt-3">
              {status !== 'Ready' && (
                <button
                  disabled={pending || tasks.isError}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
                  onClick={() =>
                    update(
                      task,
                      'status',
                      status === 'Pending' ? 'Cooking' : 'Ready',
                    )
                  }
                >
                  <Icon
                    name={status === 'Pending' ? 'fire' : 'check'}
                    size={16}
                  />
                  {pending
                    ? 'Updating…'
                    : status === 'Pending'
                      ? 'Start cooking'
                      : 'Complete'}
                </button>
              )}
              <button
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-emerald-50"
                onClick={() => onSelect(task.kitchenTaskId)}
              >
                Details
              </button>
              {status !== 'Ready' && (
                <button
                  disabled={pending || tasks.isError}
                  title="Increase priority by 10"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-emerald-50"
                  onClick={() => update(task, 'priority', task.priority + 10)}
                >
                  Priority +
                </button>
              )}
              {status !== 'Ready' && task.priority > 0 && (
                <button
                  disabled={pending || tasks.isError}
                  title="Decrease priority by 10"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-colors hover:bg-emerald-50"
                  onClick={() =>
                    update(task, 'priority', Math.max(0, task.priority - 10))
                  }
                >
                  Priority −
                </button>
              )}
              {status === 'Pending' && (
                <button
                  disabled={pending || tasks.isError}
                  className="px-3 text-sm font-semibold text-red-700"
                  onClick={() => setConfirmation(task)}
                >
                  Cancel
                </button>
              )}
              {status === 'Ready' && (
                <span className="self-center text-sm font-semibold text-brand">
                  Awaiting service
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
      {(pages > 1 || page > 1) && (
        <nav
          aria-label={`${label} pagination`}
          className="mt-4 flex items-center justify-between text-sm"
        >
          <button
            className="btn-secondary !px-3"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} / {pages}
          </span>
          <button
            className="btn-secondary !px-3"
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </nav>
      )}
      {confirmation && (
        <Modal
          title="Cancel this pending item?"
          onClose={() => setConfirmation(null)}
          closeLabel="Close"
        >
          <div className="space-y-4 p-6">
            <p>
              Cancel {confirmation.quantity} × {confirmation.nameSnapshot} in
              order #{confirmation.orderNumber}?
            </p>
            <p className="text-sm text-muted">
              This will cancel the kitchen task and its corresponding order
              item.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="btn-secondary"
                onClick={() => setConfirmation(null)}
              >
                Keep item
              </button>
              <button
                disabled={pending || tasks.isError}
                className="btn-primary !bg-red-700"
                onClick={() => {
                  update(confirmation, 'status', 'Cancelled')
                  setConfirmation(null)
                }}
              >
                Confirm cancellation
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}

function TaskDetails({ id, onClose }: { id: string; onClose: () => void }) {
  const detail = useQuery({
    queryKey: ['kitchen', 'detail', id],
    queryFn: ({ signal }) => kitchenApi.detail(id, signal),
    refetchInterval: 5000,
  })
  const task = detail.data
  return (
    <Modal title="Item details" onClose={onClose} closeLabel="Close">
      <div className="space-y-4 p-6">
        {detail.isPending && <p role="status">Loading details…</p>}
        {detail.isError && (
          <p role="alert">
            {kitchenError(detail.error)}{' '}
            <button className="underline" onClick={() => void detail.refetch()}>
              Try again
            </button>
          </p>
        )}
        {task && (
          <>
            <h3 className="text-xl font-bold">
              {task.quantity} × {task.nameSnapshot}
            </h3>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
              <dt className="text-muted">Order</dt>
              <dd>#{task.orderNumber}</dd>
              <dt className="text-muted">Station</dt>
              <dd>{task.kitchenStationName}</dd>
              <dt className="text-muted">Status</dt>
              <dd>
                {columns.find((column) => column.status === task.status)
                  ?.label ||
                  {
                    Served: 'Served',
                    Cancelled: 'Cancelled',
                    Hold: 'On hold',
                  }[task.status] ||
                  task.status}
              </dd>
              <dt className="text-muted">Priority</dt>
              <dd>{task.priority}</dd>
              <dt className="text-muted">Queued at</dt>
              <dd>{time(task.queuedAt)}</dd>
              <dt className="text-muted">Start cooking</dt>
              <dd>{time(task.cookingAt)}</dd>
              <dt className="text-muted">Complete</dt>
              <dd>{time(task.readyAt)}</dd>
            </dl>
            <div>
              <h4 className="font-semibold">Options / toppings</h4>
              {task.options?.length ? (
                <ul className="mt-2 space-y-1 text-sm">
                  {task.options.map((option) => (
                    <li key={option.optionId}>
                      {option.name} × {option.quantity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted">No options.</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold">Notes</h4>
              <p className="mt-2 whitespace-pre-wrap rounded-xl bg-amber-50 p-3 text-sm">
                {task.note || 'No notes.'}
              </p>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
