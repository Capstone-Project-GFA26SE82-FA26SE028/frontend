import { Modal } from '../../../../components/Modal/Modal'
import { DishImage } from '../../menu/components/DishImage'
import type { TakeawayDish } from '../types/types'

export function TakeawayDishDetail({
  dish,
  onClose,
}: {
  dish: TakeawayDish
  onClose: () => void
}) {
  return (
    <Modal title={dish.itemName} onClose={onClose}>
      <div className="space-y-5 p-6">
        <DishImage
          src={dish.imageUrl}
          name={dish.itemName}
          className="aspect-[4/3] rounded-2xl"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted">{dish.categoryName}</span>
          <p className="text-xl font-bold text-brand">
            {dish.price === null
              ? 'Chưa có giá'
              : dish.price.toLocaleString('vi-VN') + ' đ'}
          </p>
        </div>
        {dish.description && (
          <p className="text-sm leading-6 text-muted">{dish.description}</p>
        )}
        {dish.preparationTimeMinutes !== null && (
          <p className="text-sm text-muted">
            Thời gian chuẩn bị: {dish.preparationTimeMinutes} phút
          </p>
        )}
        {!dish.canOrder && (
          <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            {dish.unavailableReason || 'Món hiện không khả dụng.'}
          </p>
        )}
        {dish.optionGroups.map((group) => (
          <section
            key={group.optionGroupId}
            className="rounded-2xl border border-stone-200 p-4"
          >
            <h3 className="font-semibold">{group.optionGroupName}</h3>
            <p className="mt-1 text-xs text-muted">
              {group.minSelection > 0 ? 'Bắt buộc' : 'Không bắt buộc'} · Chọn{' '}
              {group.minSelection}–{group.maxSelection}
            </p>
            <ul className="mt-3 divide-y divide-stone-100">
              {group.options.map((option) => (
                <li
                  key={option.optionId}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p>{option.optionName}</p>
                    {!option.canSelect && (
                      <p className="mt-1 text-xs text-amber-700">
                        Không khả dụng
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 font-medium text-brand">
                    {option.extraPrice === 0
                      ? 'Không phụ thu'
                      : '+' + option.extraPrice.toLocaleString('vi-VN') + ' đ'}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary w-full"
        >
          Đóng
        </button>
      </div>
    </Modal>
  )
}
