import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Modal } from '../../../../components/Modal/Modal'
import {
  Card,
  Search,
  Badge,
  Empty,
} from '../../shared/ui/KitchenUI'
import { Heading } from '../../shared/components/Heading'
import { matches, useKitchen } from '../../shared/hooks'
export function KitchenRecipesPage() {
  const { state } = useKitchen()
  const [q, setQ] = useState('')
  const [params, setParams] = useSearchParams()
  const recipe = state.recipes.find(
    (r) => r.id === params.get('dish') && r.area === state.area,
  )
  const [qty, setQty] = useState(1)
  const recipes = state.recipes.filter(
    (r) => r.area === state.area && matches(r.name, q),
  )
  return (
    <>
      <Heading
        title="Recipe book"
        description="Current recipes · Kitchen has read-only access."
      />
      <Search value={q} onChange={setQ} placeholder="Search recipes…" />
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((r) => (
          <Card key={r.id}>
            <img
              src={'/images/menu/' + r.image}
              alt={r.name}
              className="mb-4 h-44 w-full rounded-xl object-cover"
            />
            <Badge>Version {r.version}</Badge>
            <h2 className="my-3 text-lg font-bold">{r.name}</h2>
            <p className="mb-4 text-xs text-slate-400">
              Effective from {r.effective} · {r.bom.length} ingredients
            </p>
            <button
              className="mgr-secondary w-full"
              onClick={() => {
                setParams({ dish: r.id })
                setQty(1)
              }}
            >
              View recipe
            </button>
          </Card>
        ))}
      </div>
      {!recipes.length && <Empty />}
      {recipe && (
        <Modal closeLabel="Close" title={recipe.name} onClose={() => setParams({})}>
          <div className="space-y-4 p-6">
            <img
              src={'/images/menu/' + recipe.image}
              alt="Reference dish image"
              className="h-48 w-full rounded-xl object-cover"
            />
            <p className="text-xs text-slate-500">
              Reference image · No instruction video available.
            </p>
            <Badge>
              v{recipe.version} · Effective {recipe.effective}
            </Badge>
            <label className="block text-sm">
              Servings to prepare
              <input
                className="mgr-input mt-2"
                type="number"
                min={1}
                max={99}
                value={qty}
                onChange={(e) =>
                  setQty(
                    Math.max(
                      1,
                      Math.min(99, Math.floor(Number(e.target.value) || 1)),
                    ),
                  )
                }
              />
            </label>
            <h3 className="font-bold">Standard quantities</h3>
            {recipe.bom.map((b) => {
              const i = state.ingredients.find((i) => i.id === b.ingredient)!
              return (
                <div
                  key={b.ingredient}
                  className="flex justify-between border-b border-slate-100 pb-2"
                >
                  <span>{i.name}</span>
                  <strong>
                    {(b.amount * qty).toFixed(2)} {i.unit}
                  </strong>
                </div>
              )
            })}
            <h3 className="font-bold">Preparation steps</h3>
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-6">
              {recipe.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="text-xs text-amber-700">
              Sample recipes for this demo. Actual recipes require manager
              approval.
            </p>
          </div>
        </Modal>
      )}
    </>
  )
}
