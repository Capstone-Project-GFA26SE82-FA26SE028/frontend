import { useState } from 'react'
import { Modal } from '../../../../components/Modal/Modal'
import {
  Card,
  Badge,
  DataTable,
  Empty,
} from '../../shared/ui/KitchenUI'
import { Heading } from '../../shared/components/Heading'
import { dateTime, useClock, useKitchen } from '../../shared/hooks'
export function KitchenIngredientsPage() {
  const { state, run, tickets } = useKitchen()
  const now = useClock()
  const [open, setOpen] = useState(false)
  const [ingredient, setIngredient] = useState('')
  const [note, setNote] = useState('')
  const [level, setLevel] = useState('Running low')
  const [error, setError] = useState('')
  const ingredients = state.ingredients.filter((i) =>
    state.recipes.some(
      (r) => r.area === state.area && r.bom.some((b) => b.ingredient === i.id),
    ),
  )
  const lots = state.lots
    .filter((l) => ingredients.some((i) => i.id === l.ingredient))
    .sort((a, b) => a.received - b.received)
  const alerts = state.alerts.filter((a) => a.area === state.area)
  return (
    <>
      <Heading
        title="Ingredients & FIFO"
        description="Monitor available stock and trace ingredients used for each dish."
        action={
          <button
            className="mgr-button"
            onClick={() => {
              setIngredient(ingredients[0]?.id || '')
              setNote('')
              setError('')
              setOpen(true)
            }}
          >
            Report ingredient shortage
          </button>
        }
      />
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ingredients.map((i) => {
          const stock = lots
            .filter((l) => l.ingredient === i.id && l.expires > now)
            .reduce((n, l) => n + l.quantity, 0)
          return (
            <Card key={i.id}>
              <div className="flex justify-between gap-2">
                <h2 className="font-bold">{i.name}</h2>
                <Badge tone={stock <= i.min ? 'amber' : 'green'}>
                  {stock <= i.min ? 'Low stock' : 'In stock'}
                </Badge>
              </div>
              <p className="my-3 text-3xl font-bold">
                {stock.toFixed(2)}{' '}
                <span className="text-sm font-normal text-slate-400">
                  {i.unit}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                Minimum stock {i.min} {i.unit} · Expired batches excluded
              </p>
            </Card>
          )
        })}
      </div>
      <Card title="Ingredient batches · First in, first out">
        <DataTable
          headers={[
            'Batch / ingredient',
            'Received date',
            'Expiry date',
            'Stock',
            'Status',
          ]}
        >
          {lots.map((l) => (
            <tr key={l.id}>
              <td>
                <strong>{l.id}</strong>
                <p className="mt-1 text-xs">
                  {ingredients.find((i) => i.id === l.ingredient)?.name}
                </p>
              </td>
              <td>{dateTime(l.received)}</td>
              <td>{dateTime(l.expires)}</td>
              <td>{l.quantity.toFixed(2)} kg</td>
              <td>
                <Badge
                  tone={
                    l.expires <= now
                      ? 'red'
                      : l.expires - now <= 86400000
                        ? 'amber'
                        : 'green'
                  }
                >
                  {l.expires <= now
                    ? 'Expired · Do not use'
                    : l.expires - now <= 86400000
                      ? 'Expiring soon'
                      : 'Within shelf life'}
                </Badge>
              </td>
            </tr>
          ))}
        </DataTable>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          When cooking starts, validate the full recipe and deduct stock by arrival
          date using FIFO, excluding expired batches. If stock is insufficient,
          the ticket and stock remain unchanged.
        </p>
      </Card>
      <div className="mt-5">
        <Card title="Alerts for Inventory & Manager">
          <p className="mb-4 text-xs text-amber-700">
            Simulated alerts. No messages are sent to real accounts or devices.
          </p>
          {alerts.map((a) => (
            <div
              key={a.id}
              className="mb-3 rounded-xl border border-slate-100 p-4"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <strong>
                  {ingredients.find((i) => i.id === a.ingredient)?.name} ·{' '}
                  {a.level}
                </strong>
                <Badge tone={a.status === 'Awaiting acknowledgment' ? 'amber' : 'green'}>
                  {a.status}
                </Badge>
              </div>
              <p className="my-2 text-sm">{a.note}</p>
              <p className="text-xs text-slate-400">
                {a.source} · {dateTime(a.time)} · Recipients: Inventory, Manager
              </p>
              {a.status === 'Awaiting acknowledgment' && (
                <details className="mt-3 text-xs text-slate-500">
                  <summary>Simulate a response</summary>
                  <button
                    className="mgr-secondary mt-2"
                    onClick={() => run({ type: 'acknowledge', id: a.id })}
                  >
                    Simulate inventory acknowledgment
                  </button>
                </details>
              )}
            </div>
          ))}
          {!alerts.length && <Empty text="No ingredient alerts yet." />}
        </Card>
      </div>
      <div className="mt-5">
        <Card title="Stock usage this session">
          <DataTable
            headers={['Ticket', 'Batch', 'Used', 'Timestamp']}
            empty={
              !state.movements.some((m) =>
                tickets.some((t) => t.id === m.ticket),
              )
            }
          >
            {state.movements
              .filter((m) => tickets.some((t) => t.id === m.ticket))
              .map((m, i) => (
                <tr key={i}>
                  <td>{m.ticket}</td>
                  <td>{m.lot}</td>
                  <td>{m.amount.toFixed(2)} kg</td>
                  <td>{dateTime(m.time)}</td>
                </tr>
              ))}
          </DataTable>
        </Card>
      </div>
      {open && (
        <Modal closeLabel="Close" title="Report ingredient shortage" onClose={() => setOpen(false)}>
          <form
            className="space-y-4 p-6"
            onSubmit={(e) => {
              e.preventDefault()
              if (run({ type: 'alert', ingredient, level, note }))
                setOpen(false)
              else setError('Select an ingredient and complete the details.')
            }}
          >
            <label className="block text-sm">
              Ingredients
              <select
                aria-label="Ingredients"
                className="mgr-input mt-2"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
              >
                {ingredients.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Severity
              <select
                aria-label="Severity"
                className="mgr-input mt-2"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option>Running low</option>
                <option>Out of stock</option>
                <option>Insufficient for order</option>
              </select>
            </label>
            <label className="block text-sm">
              Notes / quantity needed
              <textarea
                required
                maxLength={500}
                className="mgr-input mt-2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-rose-700">
                {error}
              </p>
            )}
            <p className="text-xs text-slate-500">
              Recipients: Inventory Staff and Restaurant Manager (simulated).
            </p>
            <button disabled={!note.trim()} className="mgr-button">
              Create alert
            </button>
          </form>
        </Modal>
      )}
    </>
  )
}
