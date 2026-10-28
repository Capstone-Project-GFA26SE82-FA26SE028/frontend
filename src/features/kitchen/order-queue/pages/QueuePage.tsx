import { useState } from 'react'
import {
  Search,
  Select,
  Empty,
} from '../../shared/ui/KitchenUI'
import { Heading } from '../../shared/components/Heading'
import { TicketCard } from '../../shared/components/TicketCard'
import { matches, useClock, useKitchen } from '../../shared/hooks'
import type { Status, Ticket } from '../../shared/types'
export function QueuePage({ status = 'Pending' }: { status?: Status }) {
  const { state, run, tickets } = useKitchen()
  const now = useClock()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('First in, first out')
  const [last, setLast] = useState<Ticket | null>(null)
  const items = tickets
    .filter(
      (t) =>
        t.status === status &&
        matches(
          `${t.table} ${t.order} ${state.recipes.find((r) => r.id === t.dishId)?.name}`,
          query,
        ),
    )
    .sort(
      (a, b) =>
        (sort === 'VIP priority'
          ? Number(b.vip) - Number(a.vip)
          : sort === 'Group by dish'
            ? a.dishId.localeCompare(b.dishId)
            : 0) ||
        a.created - b.created ||
        a.id.localeCompare(b.id),
    )
  const receive = () => {
    const id = `K-${Date.now()}`
    const ticket: Ticket = {
      id,
      order: `QR-${String(Date.now()).slice(-6)}`,
      table: 'Table 12',
      dishId: state.area === 'Hot kitchen' ? 'salmon' : 'juice',
      quantity: 1,
      note: 'Simulated QR menu order',
      vip: false,
      created: Date.now(),
      status: 'Pending',
    }
    setLast(ticket)
    run({ type: 'receive', eventId: id, ticket })
  }
  return (
    <>
      <Heading
        title={
          status === 'Pending'
            ? 'Preparation queue'
            : status === 'Cooking'
              ? 'Cooking'
              : 'Ready dishes'
        }
        description={
          status === 'Ready'
            ? 'Review completed dishes awaiting service.'
            : 'Keep notes with each dish, prioritize clearly and track every order.'
        }
      />
      <div className="mb-5 flex flex-wrap gap-3">
        <Search
          value={query}
          onChange={setQuery}
          placeholder="Search tables, order IDs or dishes…"
        />
        <Select
          label="Sort queue"
          value={sort}
          onChange={setSort}
          options={['First in, first out', 'VIP priority', 'Group by dish']}
        />
      </div>
      <p className="mb-4 text-xs leading-5 text-slate-500">
        {items.length} dish lines · {sort}; ties are sorted by arrival time,
        then ticket ID.
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((t) => (
          <TicketCard key={t.id} ticket={t} now={now} />
        ))}
      </div>
      {!items.length && (
        <Empty text="No matching dishes in this queue." />
      )}
      {status === 'Pending' && (
        <details className="mt-8 rounded-xl border border-dashed border-slate-300 p-4 text-sm">
          <summary className="cursor-pointer font-semibold text-slate-500">
            Demo tools · Receive QR events
          </summary>
          <p className="my-3 text-slate-500">
            Simulate incoming orders and replay events after disconnection. Live
            updates are not connected.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="mgr-secondary" onClick={receive}>
              Simulate new order
            </button>
            <button
              className="mgr-secondary disabled:opacity-40"
              disabled={!last}
              onClick={() =>
                last && run({ type: 'receive', eventId: last.id, ticket: last })
              }
            >
              Replay latest event
            </button>
          </div>
        </details>
      )}
    </>
  )
}
