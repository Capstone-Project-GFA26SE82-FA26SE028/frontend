import { useState } from 'react'
import { Modal } from '../../../../components/Modal/Modal'
import {
  Card,
  Badge,
  Search,
  Empty,
} from '../../shared/ui/KitchenUI'
import { Heading } from '../../shared/components/Heading'
import { matches, useKitchen } from '../../shared/hooks'
import type { Recipe } from '../../shared/types'
export function AvailabilityPage() {
  const { state, run } = useKitchen()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('')
  const [status, setStatus] = useState<Recipe['availability']>('Available')
  const [reason, setReason] = useState('')
  const recipes = state.recipes.filter(
    (r) => r.area === state.area && matches(r.name, query),
  )
  return (
    <>
      <Heading
        title="Dish availability"
        description="Mark dishes as unavailable or paused. Existing orders are preserved."
      />
      <Search value={query} onChange={setQuery} placeholder="Search dishes…" />
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((r) => (
          <Card key={r.id}>
            <img
              src={'/images/menu/' + r.image}
              alt={r.name}
              className="mb-4 h-40 w-full rounded-xl object-cover"
            />
            <div className="flex flex-wrap justify-between gap-2">
              <h2 className="font-bold">{r.name}</h2>
              <Badge tone={r.availability === 'Available' ? 'green' : 'amber'}>
                {r.availability}
              </Badge>
            </div>
            <p className="my-3 text-xs text-slate-400">
              {r.area} · {r.id}
            </p>
            <button
              className="mgr-secondary w-full"
              onClick={() => {
                setSelected(r.id)
                setStatus(r.availability)
                setReason('')
              }}
            >
              Update status
            </button>
          </Card>
        ))}
      </div>
      {!recipes.length && <Empty />}
      {selected && (
        <Modal closeLabel="Close" title="Update availability" onClose={() => setSelected('')}>
          <form
            className="space-y-4 p-6"
            onSubmit={(e) => {
              e.preventDefault()
              if (run({ type: 'availability', id: selected, status, reason }))
                setSelected('')
            }}
          >
            <label className="block">
              Status
              <select
                aria-label="Status"
                className="mgr-input mt-2"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as Recipe['availability'])
                }
              >
                {['Available', 'Temporarily unavailable', 'Paused'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="block">
              Reason
              <textarea
                required
                maxLength={300}
                className="mgr-input mt-2"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>
            <p className="text-xs leading-5 text-slate-500">
              This demo blocks new simulated orders in KDS. QR/POS is not connected
              yet. Only managers can permanently discontinue a dish.
            </p>
            <button disabled={!reason.trim()} className="mgr-button">
              Save status
            </button>
          </form>
        </Modal>
      )}
    </>
  )
}
