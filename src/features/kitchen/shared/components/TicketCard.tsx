import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../../../../components/Modal/Modal'
import { Badge, Card } from '../../shared/ui/KitchenUI'
import { clock, dateTime, elapsed, useKitchen } from '../hooks'
import type { Ticket } from '../types'
export function TicketCard({
  ticket: t,
  now,
}: {
  ticket: Ticket
  now: number
}) {
  const { state, run } = useKitchen()
  const [detail, setDetail] = useState(false)
  const r = state.recipes.find((r) => r.id === t.dishId)!
  return (
    <>
      <Card
        className={`border-t-4! ${t.status === 'Pending' ? 'border-t-amber-400!' : t.status === 'Cooking' ? 'border-t-sky-400!' : 'border-t-emerald-500!'}`}
      >
        <div className="mb-4 flex flex-wrap justify-between gap-2">
          <div>
            <span className="text-lg font-bold">{t.table}</span>
            <p className="mt-1 text-xs text-slate-400">
              {t.order} · {t.id}
            </p>
          </div>
          <Badge
            tone={
              t.status === 'Pending'
                ? 'amber'
                : t.status === 'Cooking'
                  ? 'blue'
                  : 'green'
            }
          >
            {t.status}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <img
            src={'/images/menu/' + r.image}
            alt=""
            className="h-16 w-16 rounded-xl object-cover"
          />
          <div>
            <h3 className="font-bold">
              {t.quantity} × {r.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Received {clock(t.created)} · {elapsed(t.created, now)}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {t.vip && <Badge tone="amber">VIP priority</Badge>}
          {t.previousNote !== undefined && (
            <Badge tone="blue">Edited</Badge>
          )}
        </div>
        <p className="my-4 min-h-12 rounded-lg bg-amber-50/70 p-3 text-sm text-amber-900">
          {t.note || 'No special requests'}
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="mgr-secondary" onClick={() => setDetail(true)}>
            Details
          </button>
          {t.status === 'Pending' && (
            <button
              className="mgr-button flex-1"
              onClick={() =>
                run({ type: 'transition', id: t.id, status: 'Cooking' })
              }
            >
              Start cooking
            </button>
          )}
          {t.status === 'Cooking' && (
            <button
              className="mgr-button flex-1"
              onClick={() =>
                run({ type: 'transition', id: t.id, status: 'Ready' })
              }
            >
              Dish ready
            </button>
          )}
          {t.status === 'Ready' && (
            <span className="self-center text-sm text-emerald-700">
              Awaiting waiter pickup
            </span>
          )}
        </div>
      </Card>
      {detail && (
        <Modal closeLabel="Close" title={`${t.id} · ${t.table}`} onClose={() => setDetail(false)}>
          <div className="space-y-4 p-6">
            <h3 className="text-xl font-bold">
              {t.quantity} × {r.name}
            </h3>
            <p>
              Order: {t.order} · {r.area}
            </p>
            <p className="rounded-lg bg-amber-50 p-3">
              {t.note || 'No notes'}
            </p>
            {t.previousNote !== undefined && (
              <p className="text-sm text-sky-700">
                Previous notes: {t.previousNote} → Current notes: {t.note}
              </p>
            )}
            <p className="text-sm leading-6">
              Received: {dateTime(t.created)}
              {t.started && ` · Started: ${clock(t.started)}`}
              {t.finished && ` · Completed: ${clock(t.finished)}`}
            </p>
            <p>Status: {t.status}</p>
            {t.reason && <p>Cancellation reason: {t.reason}</p>}
            <Link
              onClick={() => setDetail(false)}
              to={`/kitchen/recipes?dish=${r.id}`}
              className="mgr-secondary"
            >
              View current recipe
            </Link>
            <h4 className="font-bold">Activity history</h4>
            {state.logs
              .filter((l) => l.ticket === t.id)
              .map((l, i) => (
                <p key={i} className="text-sm">
                  {clock(l.time)} · {l.actor}: {l.text}
                </p>
              ))}
            <p className="text-xs text-slate-400">
              Initial tickets are sample data. New activity is logged during
              this session.
            </p>
          </div>
        </Modal>
      )}
    </>
  )
}
