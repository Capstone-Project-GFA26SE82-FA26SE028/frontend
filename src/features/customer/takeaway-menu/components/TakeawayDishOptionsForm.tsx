import { useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import type { TakeawayDish, TakeawaySelection } from '../types/types'

export function TakeawayDishOptionsForm({
  dish,
  disabled,
  pending,
  onAdd,
  initial,
  submitLabel = 'Thêm vào giỏ mang đi',
}: {
  dish: TakeawayDish
  disabled: boolean
  pending: boolean
  onAdd: (line: TakeawaySelection) => Promise<void>
  initial?: TakeawaySelection
  submitLabel?: string
}) {
  const [selected, setSelected] = useState<string[]>(
    initial?.options.map((option) => option.optionId) ?? [],
  )
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1)
  const [note, setNote] = useState(initial?.note ?? '')
  const [error, setError] = useState('')
  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault()
        setError('')
        if (disabled || pending) return
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000)
          return setError('Số lượng phải từ 1 đến 1000.')
        if (
          selected.some(
            (id) =>
              !dish.optionGroups.some((group) =>
                group.options.some((option) => option.optionId === id),
              ),
          )
        )
          return setError(
            'Tùy chọn đã thay đổi. Vui lòng đóng và tải lại giỏ hàng.',
          )
        for (const group of dish.optionGroups) {
          const count = group.options.filter((option) =>
            selected.includes(option.optionId),
          ).length
          if (count < group.minSelection || count > group.maxSelection)
            return setError(
              'Vui lòng chọn từ ' +
                group.minSelection +
                ' đến ' +
                group.maxSelection +
                ' tùy chọn cho ' +
                group.optionGroupName +
                '.',
            )
        }
        if (
          dish.optionGroups.some((group) =>
            group.options.some(
              (option) =>
                selected.includes(option.optionId) && !option.canSelect,
            ),
          )
        )
          return setError('Tùy chọn đã hết. Vui lòng chọn lại.')
        try {
          await onAdd({
            itemId: dish.itemId,
            quantity,
            note: note.trim() || null,
            options: selected.map((optionId) => ({
              optionId,
              quantity:
                initial?.options.find((option) => option.optionId === optionId)
                  ?.quantity ?? 1,
            })),
          })
        } catch (error) {
          setError(
            error instanceof Error ? error.message : 'Không thể thêm món.',
          )
        }
      }}
    >
      <fieldset
        disabled={disabled || pending || !dish.canOrder || dish.price === null}
        className="space-y-5 disabled:opacity-60"
      >
        {dish.optionGroups.map((group) => (
          <section
            key={group.optionGroupId}
            className="rounded-2xl border border-stone-200 p-4"
          >
            <h3 className="font-semibold">{group.optionGroupName}</h3>
            {group.minSelection > 0 && (
              <p className="mt-1 text-xs text-muted">
                Chọn từ {group.minSelection} đến {group.maxSelection}
              </p>
            )}
            <div className="mt-2 divide-y divide-stone-100">
              {group.options.map((option) => (
                <label
                  key={option.optionId}
                  className="flex cursor-pointer items-center gap-3 py-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.optionId)}
                    disabled={!option.canSelect}
                    className="size-4 accent-emerald-700"
                    onChange={(event) => {
                      setError('')
                      if (!event.target.checked)
                        return setSelected(
                          selected.filter((id) => id !== option.optionId),
                        )
                      if (
                        group.options.filter((item) =>
                          selected.includes(item.optionId),
                        ).length >= group.maxSelection
                      )
                        return setError(
                          'Chỉ được chọn tối đa ' +
                            group.maxSelection +
                            ' tùy chọn cho ' +
                            group.optionGroupName +
                            '.',
                        )
                      setSelected([...selected, option.optionId])
                    }}
                  />
                  <span className="flex-1">
                    {option.optionName}
                    {!option.canSelect && (
                      <span className="block text-xs text-amber-700">
                        Không khả dụng
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 font-medium text-brand">
                    {option.extraPrice === 0
                      ? 'Không phụ thu'
                      : '+' + option.extraPrice.toLocaleString('vi-VN') + ' đ'}
                  </span>
                </label>
              ))}
            </div>
          </section>
        ))}
        <div>
          <label htmlFor="takeaway-note" className="text-sm font-semibold">
            Ghi chú
          </label>
          <textarea
            id="takeaway-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={1000}
            placeholder="Ghi chú cho phục vụ"
            className="field mt-2 min-h-20"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">Số lượng</span>
          <div className="flex items-center gap-2 rounded-xl border border-stone-200 p-1">
            <button
              type="button"
              aria-label="Giảm số lượng"
              disabled={quantity <= 1}
              onClick={() => setQuantity(quantity - 1)}
              className="flex size-10 items-center justify-center rounded-lg hover:bg-emerald-50 disabled:opacity-30"
            >
              <Icon name="minus" size={16} />
            </button>
            <input
              type="number"
              aria-label="Số lượng"
              min={1}
              max={1000}
              value={Number.isNaN(quantity) ? '' : quantity}
              onChange={(event) => setQuantity(event.target.valueAsNumber)}
              className="w-14 bg-transparent text-center text-sm font-semibold outline-none"
            />
            <button
              type="button"
              aria-label="Tăng số lượng"
              disabled={quantity >= 1000 || Number.isNaN(quantity)}
              onClick={() => setQuantity(quantity + 1)}
              className="flex size-10 items-center justify-center rounded-lg hover:bg-emerald-50 disabled:opacity-30"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
        </div>
        <button type="submit" className="btn-primary min-h-12 w-full">
          {pending ? 'Đang lưu…' : submitLabel}
        </button>
      </fieldset>
      {error && (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      )}
    </form>
  )
}
