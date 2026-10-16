import { PaymentMethodCard } from '../components/PaymentMethodCard'
import { PayOSConnection } from '../components/PayOSConnection'
import { PaymentSettingsActions } from '../components/PaymentSettingsActions'
import { useState } from 'react'
import { usePaymentMethods } from '../hooks/usePaymentMethods'
import { RestaurantHeading } from '../../components/RestaurantHeading'
import { Notice } from '../../components/AdminUI'
export function PaymentMethodsPage() {
  const { state, saveMethods } = usePaymentMethods()
  const [draft, setDraft] = useState(state.methods)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const dirty =
    draft.cash !== state.methods.cash ||
    draft.payos !== state.methods.payos ||
    draft.demoConnected !== state.methods.demoConnected
  return (
    <>
      <RestaurantHeading
        title="Phương thức thanh toán"
        description="Lựa chọn cách thanh toán tại nhà hàng"
      />
      {notice && <Notice>{notice}</Notice>}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">
          Phương thức tại nhà hàng
        </h2>
        <p className="text-sm text-slate-500">
          Giữ ít nhất một phương thức thanh toán
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {(
          [
            {
              key: 'cash',
              name: 'Tiền mặt',
              symbol: '₫',
              description:
                'Thu ngân nhận tiền và xác nhận thanh toán tại quầy.',
            },
            {
              key: 'payos',
              name: 'Chuyển khoản PayOS',
              symbol: 'QR',
              description:
                'Thanh toán bằng mã QR và nhận kết quả giao dịch từ cổng thanh toán.',
            },
          ] as const
        ).map((m) => (
          <PaymentMethodCard
            key={m.key}
            name={m.name}
            symbol={m.symbol}
            description={m.description}
            enabled={draft[m.key]}
            onChange={(enabled) => {
              setDraft({ ...draft, [m.key]: enabled })
              setNotice('')
              setError('')
            }}
          />
        ))}
      </div>
      <PayOSConnection
        connected={draft.demoConnected}
        onToggle={() =>
          setDraft({
            ...draft,
            demoConnected: !draft.demoConnected,
            payos: draft.demoConnected ? false : draft.payos,
          })
        }
      />
      {error && (
        <p role="alert" className="mt-5 text-rose-600">
          {error}
        </p>
      )}
      <PaymentSettingsActions
        dirty={dirty}
        onCancel={() => {
          setDraft(state.methods)
          setError('')
          setNotice('')
        }}
        onSave={() => {
          setNotice('')
          const e = saveMethods(draft)
          setError(e)
          if (!e) setNotice('Đã lưu phương thức thanh toán mẫu.')
        }}
      />
    </>
  )
}
