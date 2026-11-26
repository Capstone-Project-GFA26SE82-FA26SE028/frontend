import { useEffect } from 'react'
import type { PaymentMethod } from '../types'
import { useAppSelector } from '../../../../app/hooks'

type PaymentMethodSelectorProps = {
  method: PaymentMethod
  disabled: boolean
  onChange: (method: PaymentMethod) => void
}

export function PaymentMethodSelector({
  method,
  disabled,
  onChange,
}: PaymentMethodSelectorProps) {
  const adminMethods = useAppSelector((s) => s.adminPaymentMethods)

  // Map admin settings to customer selectable methods (Cash & PayOS only)
  const availableOptions: {
    id: PaymentMethod
    label: string
    description: string
    enabled: boolean
  }[] = [
    {
      id: 'cash',
      label: 'Tiền mặt tại bàn',
      description: 'Nhân viên phục vụ hỗ trợ thu tiền mặt và trả tiền thừa tận bàn.',
      enabled: adminMethods.cash,
    },
    {
      id: 'payos',
      label: 'Chuyển khoản VietQR (PayOS)',
      description: 'Quét mã VietQR động bằng app ngân hàng, hệ thống tự động xác nhận tức thì.',
      enabled: adminMethods.payos,
    },
  ]

  // Filter only active methods enabled by the restaurant
  const enabledOptions = availableOptions.filter((opt) => opt.enabled)
  const effectiveOptions = enabledOptions.length > 0 ? enabledOptions : availableOptions

  // If current method is disabled, auto select first enabled method
  useEffect(() => {
    if (enabledOptions.length > 0 && !enabledOptions.some((opt) => opt.id === method)) {
      onChange(enabledOptions[0].id)
    }
  }, [adminMethods, method, onChange, enabledOptions])

  return (
    <fieldset disabled={disabled} className="mt-7">
      <legend className="mb-4 text-lg font-bold">
        Bạn muốn thanh toán bằng cách nào?
      </legend>
      <div className="space-y-3">
        {effectiveOptions.map((m) => (
          <label
            key={m.id}
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-5 transition-colors ${
              method === m.id
                ? 'border-brand bg-mint shadow-sm'
                : 'border-stone-200 hover:border-brand/40 hover:bg-stone-50'
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={method === m.id}
              onChange={() => onChange(m.id)}
              className="mt-1 accent-brand"
            />
            <span className="min-w-0 flex-1">
              <strong className="text-sm text-stone-900">{m.label}</strong>
              <span className="mt-1 block text-sm leading-6 text-muted">
                {m.description}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
