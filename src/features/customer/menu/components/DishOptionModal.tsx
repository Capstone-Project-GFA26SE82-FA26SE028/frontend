import { useState } from 'react'
import { Modal } from '../../../../components/Modal/Modal'
import { Icon } from '../../../../components/Icon/Icon'
import { useAppDispatch } from '../../../../app/hooks'
import { addItem } from '../../cart/cartSlice'
import { formatCurrency } from '../../../../utils/currency'
import type { Dish } from '../types'
export function DishOptionModal({
  dish,
  onClose,
  onAdded,
}: {
  dish: Dish
  onClose: () => void
  onAdded: () => void
}) {
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const [large, setLarge] = useState(false)
  const dispatch = useAppDispatch()
  const price = dish.price + (large ? 25000 : 0)
  return (
    <Modal title="Một món ngon, theo ý bạn" onClose={onClose}>
      <img
        src={dish.image}
        alt={dish.name}
        className="aspect-[2] w-full object-cover"
      />
      <div className="space-y-5 p-6">
        <div>
          <p className="eyebrow">
            {dish.vegetarian ? 'Tươi lành · Món chay' : 'Từ căn bếp Mộc'}
          </p>
          <h3 className="mt-2 text-2xl font-bold">{dish.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {dish.description}
          </p>
          <p className="mt-3 text-sm">
            <strong>Thành phần:</strong> {dish.ingredients}.
          </p>
        </div>
        {dish.category !== 'drink' && dish.category !== 'dessert' && (
          <fieldset>
            <legend className="mb-3 font-semibold">Chọn khẩu phần</legend>
            <div className="grid grid-cols-2 gap-3">
              {[false, true].map((v) => (
                <label
                  key={String(v)}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${large === v ? 'border-brand bg-mint' : 'border-stone-200'}`}
                >
                  <input
                    type="radio"
                    name="portion"
                    checked={large === v}
                    onChange={() => setLarge(v)}
                    className="accent-brand"
                  />
                  {v ? 'Phần lớn +25.000 ₫' : 'Phần tiêu chuẩn'}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <label className="block text-sm font-semibold" htmlFor="dish-note">
          Ghi chú cho bếp{' '}
          <span className="font-normal text-muted">(không bắt buộc)</span>
          <textarea
            id="dish-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="Ví dụ: ít cay, không hành..."
            className="field mt-2 resize-none font-normal"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl border border-stone-200">
            <button
              aria-label="Giảm số lượng"
              disabled={quantity === 1}
              onClick={() => setQuantity((q) => q - 1)}
              className="flex size-12 items-center justify-center"
            >
              <Icon name="minus" />
            </button>
            <span className="w-6 text-center font-semibold">{quantity}</span>
            <button
              aria-label="Tăng số lượng"
              disabled={quantity === 20}
              onClick={() => setQuantity((q) => q + 1)}
              className="flex size-12 items-center justify-center"
            >
              <Icon name="plus" />
            </button>
          </div>
          <button
            disabled={!dish.available}
            className="btn-primary grow"
            onClick={() => {
              dispatch(
                addItem({
                  id: crypto.randomUUID(),
                  dishId: dish.id,
                  name: dish.name,
                  quantity,
                  unitPrice: price,
                  note: note.trim(),
                  image: dish.image,
                  option: large ? 'Phần lớn' : 'Tiêu chuẩn',
                }),
              )
              onAdded()
              onClose()
            }}
          >
            {dish.available
              ? `Thêm · ${formatCurrency(price * quantity)}`
              : 'Tạm hết món'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
