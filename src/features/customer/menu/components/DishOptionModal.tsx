import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Modal } from '../../../../components/Modal/Modal'
import { Icon } from '../../../../components/Icon/Icon'
import { useAppDispatch } from '../../../../app/hooks'
import { addItem } from '../../cart/cartSlice'
import { formatCurrency } from '../../../../utils/currency'
import { getMenuItem, menuError } from '../api/menuApi'
import { DishImage } from './DishImage'
import type { Dish, OptionSelection } from '../types/types'
export function DishOptionModal({
  itemId,
  sessionId,
  onClose,
  onAdded,
}: {
  itemId: string
  sessionId: string
  onClose: () => void
  onAdded: () => void
}) {
  const detail = useQuery({
    queryKey: ['customer-menu-detail', sessionId, itemId],
    queryFn: ({ signal }) => getMenuItem(sessionId, itemId, signal),
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  })
  return (
    <Modal title="Dish details" closeLabel="Close" onClose={onClose}>
      {detail.isPending ? (
        <p role="status" className="p-8">
          Loading dish...
        </p>
      ) : detail.isError ? (
        <div className="space-y-4 p-6">
          <p role="alert" className="text-rose-700">
            {menuError(detail.error)}
          </p>
          <button
            className="btn-secondary"
            onClick={() => void detail.refetch()}
          >
            Try again
          </button>
        </div>
      ) : (
        <DishOptionsForm
          key={itemId + ':' + detail.dataUpdatedAt}
          dish={detail.data}
          sessionId={sessionId}
          onClose={onClose}
          onAdded={onAdded}
          refreshing={detail.isFetching}
        />
      )}
    </Modal>
  )
}
function DishOptionsForm({
  dish,
  sessionId,
  onClose,
  onAdded,
  refreshing,
}: {
  dish: Dish
  sessionId: string
  onClose: () => void
  onAdded: () => void
  refreshing: boolean
}) {
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const [selected, setSelected] = useState<Record<string, string[]>>({})
  const [error, setError] = useState('')
  const dispatch = useAppDispatch()
  const selectedOptions = dish.optionGroups.flatMap((g) =>
    g.options.filter((o) =>
      (selected[g.optionGroupId] || []).includes(o.optionId),
    ),
  )
  const unitPrice =
    (dish.price ?? 0) +
    selectedOptions.reduce((sum, o) => sum + o.extraPrice, 0)
  const invalidGroup = dish.optionGroups.find((g) => {
    const count = (selected[g.optionGroupId] || []).length
    return count < g.minSelection || count > g.maxSelection
  })
  const available = dish.canOrder && dish.price !== null
  function add() {
    if (!available || refreshing) return
    if (invalidGroup) {
      setError(
        'Please check your choices for ' + invalidGroup.optionGroupName + '.',
      )
      return
    }
    const optionSelections: OptionSelection[] = dish.optionGroups
      .map((g) => ({
        optionGroupId: g.optionGroupId,
        optionIds: [...(selected[g.optionGroupId] || [])].sort(),
      }))
      .filter((g) => g.optionIds.length)
    dispatch(
      addItem({
        id: crypto.randomUUID(),
        dishId: dish.itemId,
        name: dish.itemName,
        quantity,
        unitPrice,
        note: note.trim(),
        image: dish.imageUrl || '',
        option:
          selectedOptions.map((o) => o.optionName).join(', ') || 'Standard',
        tableSessionId: sessionId,
        priceId: dish.priceId,
        optionSelections,
      }),
    )
    onAdded()
    onClose()
  }
  return (
    <>
      <DishImage
        src={dish.imageUrl}
        name={dish.itemName}
        className="aspect-[2] w-full"
      />
      <div className="space-y-5 p-6">
        <div>
          <p className="eyebrow">{dish.categoryName}</p>
          <h3 className="mt-2 text-2xl font-bold">{dish.itemName}</h3>
          {dish.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {dish.description}
            </p>
          )}
          <p className="mt-3 text-lg font-semibold text-brand">
            {dish.price === null
              ? 'Price unavailable'
              : formatCurrency(dish.price)}
          </p>
          {!available && (
            <p
              role="status"
              className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"
            >
              {dish.unavailableReason || 'This dish is currently unavailable.'}
            </p>
          )}
        </div>
        {dish.optionGroups.map((g) => (
          <fieldset key={g.optionGroupId}>
            <legend className="font-semibold">{g.optionGroupName}</legend>
            <div className="mt-3 space-y-2">
              {g.options.map((o) => {
                const chosen = selected[g.optionGroupId] || []
                const checked = chosen.includes(o.optionId)
                return (
                  <label
                    key={o.optionId}
                    className={
                      'flex items-center gap-3 rounded-xl border p-3 text-sm ' +
                      (!o.canSelect
                        ? 'opacity-45'
                        : checked
                          ? 'border-brand bg-mint'
                          : 'border-stone-200')
                    }
                  >
                    <input
                      type="checkbox"
                      className="accent-brand"
                      checked={checked}
                      disabled={
                        !o.canSelect ||
                        g.maxSelection === 0 ||
                        (!checked &&
                          g.maxSelection > 1 &&
                          chosen.length >= g.maxSelection)
                      }
                      onChange={() => {
                        setError('')
                        setSelected((prev) => ({
                          ...prev,
                          [g.optionGroupId]: checked
                            ? chosen.filter((id) => id !== o.optionId)
                            : g.maxSelection === 1
                              ? [o.optionId]
                              : [...chosen, o.optionId],
                        }))
                      }}
                    />
                    <span className="flex-1">
                      {o.optionName}
                      {!o.canSelect && (
                        <span className="ml-2 text-xs">Unavailable</span>
                      )}
                    </span>
                    <span>
                      {o.extraPrice > 0
                        ? '+' + formatCurrency(o.extraPrice)
                        : 'Included'}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        ))}
        <label className="block text-sm font-semibold" htmlFor="dish-note">
          Kitchen note{' '}
          <span className="font-normal text-muted">(optional)</span>
          <textarea
            id="dish-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="Any preferences?"
            className="field mt-2 resize-none font-normal"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-rose-700">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl border border-stone-200">
            <button
              aria-label="Decrease quantity"
              disabled={quantity === 1}
              onClick={() => setQuantity((q) => q - 1)}
              className="flex size-12 items-center justify-center"
            >
              <Icon name="minus" />
            </button>
            <span className="w-6 text-center font-semibold">{quantity}</span>
            <button
              aria-label="Increase quantity"
              disabled={quantity === 20}
              onClick={() => setQuantity((q) => q + 1)}
              className="flex size-12 items-center justify-center"
            >
              <Icon name="plus" />
            </button>
          </div>
          <button
            disabled={!available || refreshing}
            className="btn-primary grow"
            onClick={add}
          >
            {available
              ? 'Add - ' + formatCurrency(unitPrice * quantity)
              : 'Unavailable'}
          </button>
        </div>
      </div>
    </>
  )
}
