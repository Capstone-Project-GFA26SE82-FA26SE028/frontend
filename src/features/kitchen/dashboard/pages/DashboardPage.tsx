import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Stats,
  Card,
  Select,
  Empty,
} from '../../shared/ui/KitchenUI'
import { Heading } from '../../shared/components/Heading'
import { TicketCard } from '../../shared/components/TicketCard'
import { useClock, useKitchen } from '../../shared/hooks'
export function KitchenDashboardPage() {
  const { tickets, state } = useKitchen()
  const now = useClock()
  const [period, setPeriod] = useState('Today')
  const start =
    period === 'Last 60 minutes'
      ? now - 3600000
      : period === 'Today'
        ? new Date(new Date(now).toDateString()).getTime()
        : 0
  const done = tickets.filter(
    (t) =>
      t.started &&
      t.finished &&
      t.finished >= start &&
      ['Ready', 'Served'].includes(t.status),
  )
  const avg = done.length
    ? Math.round(
        done.reduce((n, t) => n + (t.finished! - t.started!), 0) /
          done.length /
          60000,
      )
    : null
  return (
    <>
      <Heading
        title="Kitchen overview"
        description="Keep the kitchen in sync and every dish on track."
        action={
          <Link to="/kitchen/kds" className="mgr-button">
            Open kitchen display →
          </Link>
        }
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-[#003b2e] p-6 text-white">
        <div>
          <p className="text-xs tracking-widest text-emerald-200">
            SERVICE SHIFT · {state.area.toUpperCase()}
          </p>
          <h2 className="mt-3 text-2xl font-bold">Focus on great food.</h2>
          <p className="mt-2 text-sm text-emerald-100/70">
            Track every dish from arrival to ready for service.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3">
          <p className="text-xs text-emerald-200">Kitchen clock</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {new Date(now).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="mt-1 text-xs text-white/50">Sample session data</p>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Current queue · Average time for the selected period
        </p>
        <Select
          label="Reporting period"
          value={period}
          onChange={setPeriod}
          options={['Today', 'Last 60 minutes', 'Entire demo session']}
        />
      </div>
      <Stats
        items={[
          {
            label: 'Pending dishes',
            value: tickets
              .filter((t) => t.status === 'Pending')
              .reduce((n, t) => n + t.quantity, 0),
            note: 'Total pending servings',
            icon: 'clipboard',
            tone: 'bg-amber-50 text-amber-600',
          },
          {
            label: 'Dishes being prepared',
            value: tickets
              .filter((t) => t.status === 'Cooking')
              .reduce((n, t) => n + t.quantity, 0),
            note: 'Total servings being cooked',
            icon: 'fire',
            tone: 'bg-sky-50 text-sky-600',
          },
          {
            label: 'Ready for service',
            value: tickets
              .filter((t) => t.status === 'Ready')
              .reduce((n, t) => n + t.quantity, 0),
            note: 'Awaiting waiter pickup',
            icon: 'service',
          },
          {
            label: 'Average cooking time',
            value: avg === null ? 'No data yet' : `${avg} min`,
            note: `${done.length} dish lines · Cooking to Ready`,
            icon: 'clock',
          },
        ]}
      />
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold">Up next</h2>
        <Link to="/kitchen/queue" className="text-sm text-emerald-700">
          View all →
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tickets
          .filter((t) => t.status === 'Pending')
          .sort((a, b) => a.created - b.created)
          .slice(0, 3)
          .map((t) => (
            <TicketCard key={t.id} ticket={t} now={now} />
          ))}
      </div>
      {!tickets.some((t) => t.status === 'Pending') && (
        <Empty text="All pending dishes have been accepted." />
      )}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card title="Service coordination">
          <p className="text-sm text-slate-500">
            {
              state.notifications.filter(
                (n) =>
                  n.status !== 'simulated' &&
                  tickets.some((t) => t.id === n.ticket),
              ).length
            }{' '}
            simulated notifications awaiting delivery.
          </p>
          <Link
            to="/kitchen/notifications"
            className="mt-4 inline-block text-sm text-emerald-700"
          >
            Review notifications →
          </Link>
        </Card>
        <Card title="Ingredients to watch">
          <p className="text-sm text-slate-500">
            {state.alerts.filter((a) => a.area === state.area).length} alerts
            in this session. Stock is deducted when cooking starts.
          </p>
          <Link
            to="/kitchen/ingredients"
            className="mt-4 inline-block text-sm text-emerald-700"
          >
            View ingredients →
          </Link>
        </Card>
      </div>
    </>
  )
}
