import { useState } from 'react'
import {
  Card,
  DataTable,
  Search,
  Select,
  Badge,
} from '../../shared/ui/KitchenUI'
import { Heading } from '../../shared/components/Heading'
import { dateTime, matches, useKitchen } from '../../shared/hooks'
export function KitchenHistoryPage() {
  const { state, tickets } = useKitchen()
  const [query, setQuery] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [status, setStatus] = useState('All')
  const start = from ? new Date(from + 'T00:00:00').getTime() : -Infinity
  const end = to ? new Date(to + 'T23:59:59.999').getTime() : Infinity
  const invalid = start > end
  const rows = tickets
    .filter(
      (t) =>
        ['Ready', 'Served', 'Cancelled'].includes(t.status) &&
        t.finished !== undefined &&
        t.finished >= start &&
        t.finished <= end &&
        (status === 'All' || t.status === status) &&
        matches(
          `${t.table} ${t.order} ${t.id} ${state.recipes.find((r) => r.id === t.dishId)?.name}`,
          query,
        ),
    )
    .sort((a, b) => b.finished! - a.finished!)
  return (
    <>
      <Heading
        title="KDS history"
        description={`${state.area} · Review processed dishes and their read-only history.`}
      />
      <Card>
        <div className="mb-5 flex flex-wrap items-end gap-3">
          <Search
            value={query}
            onChange={setQuery}
            placeholder="Search tables, orders or dishes…"
          />
          <label className="text-xs text-slate-500">
            From date
            <input
              aria-label="From date"
              className="mgr-input mt-1"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="text-xs text-slate-500">
            To date
            <input
              aria-label="To date"
              className="mgr-input mt-1"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          <Select
            label="History status"
            value={status}
            onChange={setStatus}
            options={['All', 'Ready', 'Served', 'Cancelled']}
          />
        </div>
        {invalid && (
          <p role="alert" className="mb-3 text-sm text-rose-700">
            The start date must not be after the end date.
          </p>
        )}
        <DataTable
          headers={[
            'Ticket / order',
            'Table / dish',
            'Servings',
            'Status',
            'Completed',
            'Cancellation reason',
          ]}
          empty={!rows.length}
        >
          {rows.map((t) => (
            <tr key={t.id}>
              <td>
                <strong>{t.id}</strong>
                <p className="text-xs">{t.order}</p>
              </td>
              <td>
                {t.table}
                <p className="text-xs">
                  {state.recipes.find((r) => r.id === t.dishId)?.name}
                </p>
              </td>
              <td>{t.quantity}</td>
              <td>
                <Badge tone={t.status === 'Cancelled' ? 'red' : 'green'}>
                  {t.status}
                </Badge>
              </td>
              <td>{dateTime(t.finished!)}</td>
              <td>{t.reason || '—'}</td>
            </tr>
          ))}
        </DataTable>
      </Card>
      <div className="mt-5">
        <Card title="Session activity log">
          <DataTable
            headers={['Time', 'Performed by', 'Action']}
            empty={!state.logs.some((l) => l.area === state.area)}
          >
            {state.logs
              .filter(
                (l) =>
                  l.area === state.area && l.time >= start && l.time <= end,
              )
              .map((l, i) => (
                <tr key={i}>
                  <td>{dateTime(l.time)}</td>
                  <td>{l.actor}</td>
                  <td className="whitespace-normal!">{l.text}</td>
                </tr>
              ))}
          </DataTable>
          <p className="mt-4 text-xs text-slate-500">
            History is stored only in this demo session. Reloading resets
            the data.
          </p>
        </Card>
      </div>
    </>
  )
}
