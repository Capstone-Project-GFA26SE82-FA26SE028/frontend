import { useState } from 'react'
import {
  Card,
  Badge,
  Empty,
} from '../../shared/ui/KitchenUI'
import { Heading } from '../../shared/components/Heading'
import { dateTime, useKitchen } from '../../shared/hooks'
export function KitchenNotificationsPage() {
  const { state, run, tickets } = useKitchen()
  const [tab, setTab] = useState('Ready dishes')
  const [ticket, setTicket] = useState('')
  const [reason, setReason] = useState('')
  const notifications = state.notifications.filter((n) =>
    tickets.some((t) => t.id === n.ticket),
  )
  const cancelled = tickets.filter((t) => t.status === 'Cancelled')
  return (
    <>
      <Heading
        title="Notifications & coordination"
        description="Track ready dishes and cancellation requests from waiters or guests."
      />
      <div className="mb-5 flex flex-wrap gap-2">
        {['Ready dishes', 'Cancelled dishes'].map((v) => (
          <button
            key={v}
            className={tab === v ? 'mgr-button' : 'mgr-secondary'}
            onClick={() => setTab(v)}
          >
            {v} ({v === 'Ready dishes' ? notifications.length : cancelled.length})
          </button>
        ))}
      </div>
      <div className="mb-5 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
        Demo mode: notifications are only updated here. No push notifications or
        alerts are sent to real waiters. Simulate a failure and retry to verify one
        notification per ready dish.
      </div>
      {tab === 'Ready dishes' ? (
        <div className="space-y-4">
          {notifications.map((n) => {
            const t = tickets.find((t) => t.id === n.ticket)!
            return (
              <Card key={n.id}>
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h2 className="font-bold">
                      {t.table} · {t.quantity} ×{' '}
                      {state.recipes.find((r) => r.id === t.dishId)?.name}
                    </h2>
                    <p className="mt-2 text-xs text-slate-500">
                      {n.id} · {dateTime(n.time)} · {n.attempts} attempts
                    </p>
                  </div>
                  <Badge
                    tone={
                      n.status === 'failed'
                        ? 'red'
                        : n.status === 'pending'
                          ? 'amber'
                          : 'green'
                    }
                  >
                    {n.status === 'failed'
                      ? 'Simulated delivery failed'
                      : n.status === 'pending'
                        ? 'Awaiting simulated delivery'
                        : 'Sent in simulation'}
                  </Badge>
                </div>
                {n.status !== 'simulated' && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="mgr-button"
                      onClick={() =>
                        run({ type: 'notify', id: n.id, fail: false })
                      }
                    >
                      {n.status === 'failed'
                        ? 'Simulate retry'
                        : 'Simulate waiter notification'}
                    </button>
                    <button
                      className="mgr-secondary"
                      onClick={() =>
                        run({ type: 'notify', id: n.id, fail: true })
                      }
                    >
                      Simulate connection failure
                    </button>
                  </div>
                )}
              </Card>
            )
          })}
          {!notifications.length && <Empty text="No dishes marked ready yet." />}
        </div>
      ) : (
        <div className="space-y-4">
          {cancelled.map((t) => (
            <Card key={t.id}>
              <Badge tone="red">Cancelled</Badge>
              <h2 className="my-3 font-bold">
                {t.table} · {t.quantity} ×{' '}
                {state.recipes.find((r) => r.id === t.dishId)?.name}
              </h2>
              <p className="text-sm">Reason: {t.reason}</p>
              <p className="mt-2 text-xs text-slate-500">
                {t.id} · {dateTime(t.finished!)} · No stock deducted.
              </p>
            </Card>
          ))}
          {!cancelled.length && <Empty text="No cancelled dishes yet." />}
        </div>
      )}
      <details className="mt-6 rounded-xl border border-dashed border-slate-300 p-4 text-sm">
        <summary className="cursor-pointer font-semibold text-slate-500">
          Demo tools · Receive cancellation requests
        </summary>
        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (run({ type: 'cancel', id: ticket, reason })) setReason('')
          }}
        >
          <label className="block">
            Dish line
            <select
              aria-label="Dish line"
              required
              className="mgr-input mt-2"
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
            >
              <option value="">Select ticket</option>
              {tickets
                .filter((t) => t.status !== 'Cancelled')
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id} · {t.table} · {t.status}
                  </option>
                ))}
            </select>
          </label>
          <label className="block">
            Cancellation reason
            <textarea
              required
              maxLength={300}
              className="mgr-input mt-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <p className="text-xs text-slate-500">
            Only pending dishes can be cancelled. Select Cooking/Ready/Served to test
            rejection.
          </p>
          <button
            className="mgr-secondary"
            disabled={!ticket || !reason.trim()}
          >
            Simulate cancellation request
          </button>
        </form>
      </details>
    </>
  )
}
