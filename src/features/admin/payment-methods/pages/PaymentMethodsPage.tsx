import { useState, useCallback, useEffect } from 'react'
import { PaymentMethodCard } from '../components/PaymentMethodCard'
import { PayOSConnection } from '../components/PayOSConnection'
import { PaymentSettingsActions } from '../components/PaymentSettingsActions'
import { usePaymentMethods } from '../hooks/usePaymentMethods'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { toast } from 'react-toastify'
import { useAppSelector } from '../../../../app/hooks'
import { getPayOsConfig, updatePayOsConfig } from '../api/paymentSettingsApi'
import type { PaymentMethodKey, PayOsConfig } from '../schema'

type StatusFilter = 'all' | 'enabled' | 'disabled'

const ALL_METHODS: {
  key: PaymentMethodKey
  name: string
  symbol: string
  description: string
}[] = [
  {
    key: 'cash',
    name: 'Tiền mặt',
    symbol: '₫',
    description: 'Thu ngân nhận tiền và xác nhận thanh toán trực tiếp tại quầy.',
  },
  {
    key: 'payos',
    name: 'Chuyển khoản PayOS',
    symbol: 'QR',
    description:
      'Tạo mã VietQR động theo đơn và tự động xác nhận qua cổng PayOS.',
  },
]

export function PaymentMethodsPage() {
  const user = useAppSelector((s) => s.auth.session?.user)
  const restaurantId = user?.restaurantId || undefined
  const { state, saveMethods } = usePaymentMethods()
  const [draft, setDraft] = useState(state.methods)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [error, setError] = useState('')

  const dirty =
    draft.cash !== state.methods.cash ||
    draft.payos !== state.methods.payos ||
    JSON.stringify(draft.payosConfig) !== JSON.stringify(state.methods.payosConfig)

  useEffect(() => {
    if (!restaurantId) return
    let active = true
    getPayOsConfig(restaurantId)
      .then((cfg) => {
        if (!active) return
        if (cfg.configured) {
          setDraft((prev) => ({
            ...prev,
            payos: cfg.enabled,
            payosConfig: {
              clientId: cfg.clientId,
              apiKey: prev.payosConfig?.apiKey || '',
              checksumKey: prev.payosConfig?.checksumKey || '',
              returnUrl: cfg.returnUrl,
              cancelUrl: cfg.cancelUrl,
              webhookUrl: cfg.webhookUrl,
              enabled: cfg.enabled,
              configured: true,
            },
          }))
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [restaurantId])

  const filteredMethods = ALL_METHODS.filter((m) => {
    const isEnabled = draft[m.key]
    if (filter === 'enabled') return isEnabled
    if (filter === 'disabled') return !isEnabled
    return true
  })

  const handleUpdateConfig = useCallback((newConfig: PayOsConfig) => {
    setDraft((prev) => ({
      ...prev,
      payosConfig: newConfig,
    }))
  }, [])

  return (
    <>
      <PageHeading
        eyebrow="Quản trị nhà hàng"
        title="Phương thức thanh toán"
        description="Bật hoặc tắt các phương thức thanh toán khả dụng cho khách hàng và thu ngân."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Phương thức thanh toán ({ALL_METHODS.length})
          </h2>
          <p className="text-sm text-slate-500">
            Hệ thống yêu cầu duy trì ít nhất một phương thức thanh toán khả dụng.
          </p>
        </div>

        {/* Status Filter Tab */}
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-medium text-slate-600">
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 transition-colors ${filter === 'all' ? 'bg-white font-semibold text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
            onClick={() => setFilter('all')}
          >
            Tất cả ({ALL_METHODS.length})
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 transition-colors ${filter === 'enabled' ? 'bg-white font-semibold text-emerald-800 shadow-sm' : 'hover:text-slate-900'}`}
            onClick={() => setFilter('enabled')}
          >
            Đang bật ({ALL_METHODS.filter((m) => draft[m.key]).length})
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 transition-colors ${filter === 'disabled' ? 'bg-white font-semibold text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
            onClick={() => setFilter('disabled')}
          >
            Đang tắt ({ALL_METHODS.filter((m) => !draft[m.key]).length})
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {filteredMethods.map((m) => {
          const isPayOs = m.key === 'payos'
          const isConnected = Boolean(draft.payosConfig?.configured || draft.payosConfig?.clientId)
          const isDisabled = isPayOs && !isConnected

          return (
            <PaymentMethodCard
              key={m.key}
              name={m.name}
              symbol={m.symbol}
              description={m.description}
              enabled={draft[m.key]}
              disabled={isDisabled}
              disabledReason={
                isDisabled
                  ? 'Chưa kết nối cổng thanh toán. Vui lòng thiết lập cấu hình PayOS bên dưới trước khi bật.'
                  : undefined
              }
              onChange={(enabled) => {
                if (isPayOs && enabled && !isConnected) {
                  setError('Cần thiết lập cấu hình hoặc kết nối PayOS trước khi bật.')
                  return
                }
                setDraft({ ...draft, [m.key]: enabled })
                setError('')
              }}
            />
          )
        })}
      </div>

      <PayOSConnection
        restaurantId={restaurantId}
        config={draft.payosConfig}
        onUpdateConfig={handleUpdateConfig}
      />

      {error && (
        <p role="alert" className="mt-5 text-sm font-medium text-rose-600">
          {error}
        </p>
      )}

      <PaymentSettingsActions
        dirty={dirty}
        onCancel={() => {
          setDraft(state.methods)
          setError('')
        }}
        onSave={async () => {
          const e = saveMethods(draft)
          if (e) {
            setError(e)
            return
          }

          if (restaurantId && draft.payosConfig?.configured && draft.payosConfig.clientId) {
            try {
              await updatePayOsConfig(restaurantId, {
                clientId: draft.payosConfig.clientId,
                enabled: draft.payos,
              })
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : 'Lỗi đồng bộ'
              console.warn('Không thể đồng bộ trạng thái PayOS lên máy chủ:', msg)
            }
          }

          setError('')
          toast.success('Đã lưu cấu hình phương thức thanh toán.')
        }}
      />
    </>
  )
}
