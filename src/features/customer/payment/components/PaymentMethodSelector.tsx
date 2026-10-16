import type { PaymentMethod } from '../types'

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
  return (
    <fieldset disabled={disabled} className="mt-7">
      <legend className="mb-4 text-lg font-bold">
        Bạn muốn thanh toán bằng cách nào?
      </legend>
      {(
        [
          {
            id: 'cash',
            label: 'Tiền mặt tại bàn',
            description: 'Nhân viên hỗ trợ thu tiền và xác nhận với thu ngân.',
          },
          {
            id: 'bank',
            label: 'Chuyển khoản ngân hàng',
            description: 'Vui lòng liên hệ nhân viên để nhận mã chuyển khoản.',
          },
        ] satisfies { id: PaymentMethod; label: string; description: string }[]
      ).map((m) => (
        <label
          key={m.id}
          className={`mb-3 flex cursor-pointer items-start gap-3 rounded-2xl border p-5 ${method === m.id ? 'border-brand bg-mint' : 'border-stone-200'}`}
        >
          <input
            type="radio"
            name="payment"
            checked={method === m.id}
            onChange={() => onChange(m.id)}
            className="mt-1 accent-brand"
          />
          <span>
            <strong className="text-sm">{m.label}</strong>
            <span className="mt-1 block text-sm leading-6 text-muted">
              {m.description}
            </span>
          </span>
        </label>
      ))}
    </fieldset>
  )
}
