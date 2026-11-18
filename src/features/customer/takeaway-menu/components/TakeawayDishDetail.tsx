import { Modal } from '../../../../components/Modal/Modal'
import { Icon } from '../../../../components/Icon/Icon'
import type { TakeawayDish, TakeawaySelection } from '../types/types'
import { useState } from 'react'
import { TakeawayDishOptionsForm } from './TakeawayDishOptionsForm'

export function TakeawayDishDetail({
  dish,
  onClose,
  onAdd,
  pending,
  disabled,
  cartError,
  cartLoading,
  onReload,
}: {
  dish: TakeawayDish
  onClose: () => void
  onAdd: (line: TakeawaySelection) => Promise<void>
  pending: boolean
  disabled: boolean
  cartError: string
  cartLoading: boolean
  onReload: () => void
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  return (
    <Modal title={dish.itemName} onClose={onClose}>
      <div className="space-y-5 p-6">
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-mint">
          {dish.imageUrl &&
          /^https?:\/\//i.test(dish.imageUrl) &&
          failedUrl !== dish.imageUrl ? (
            <img
              src={dish.imageUrl}
              alt={dish.itemName}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setFailedUrl(dish.imageUrl)}
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon name="utensils" size={40} className="text-brand/35" />
          )}
        </div>
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
        {cartError && (
          <div
            role="alert"
            className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900"
          >
            <p>{cartError}</p>
            <button
              type="button"
              disabled={pending || cartLoading}
              onClick={onReload}
              className="mt-3 font-semibold underline underline-offset-4 disabled:opacity-40"
            >
              {cartLoading ? 'Đang tải…' : 'Tải lại giỏ hàng'}
            </button>
          </div>
        )}
        {!cartError && cartLoading && (
          <p role="status" className="text-sm text-muted">
            Đang tải giỏ hàng…
          </p>
        )}
        <TakeawayDishOptionsForm
          dish={dish}
          pending={pending}
          disabled={disabled}
          onAdd={onAdd}
        />
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="btn-secondary w-full"
        >
          Đóng
        </button>
      </div>
    </Modal>
  )
}
