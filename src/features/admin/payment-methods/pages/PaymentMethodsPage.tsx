import { useState } from 'react'
import { Modal } from '../../../../components/Modal/Modal'
import { PaymentMethodCard } from '../components/PaymentMethodCard'
import type { PayOsConfiguration, PayOsSettings } from '../types/types'
import { useAppSelector } from '../../../../app/hooks'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { payOsError } from '../api/payOsApi'
import { PayOsSettingsForm } from '../components/PayOsSettingsForm'
import { usePayOsConfiguration } from '../hooks/usePayOsConfiguration'

export function PaymentMethodsPage() {
  const user = useAppSelector((state) => state.auth.session?.user)
  const restaurantId = user?.restaurantId ?? ''
  const { configuration, save, updateStatus, updatingStatus } = usePayOsConfiguration(restaurantId, user?.userId ?? '')

  return (
    <>
      <PageHeading title="Phương thức thanh toán" description="Cấu hình nhận chuyển khoản qua PayOS cho nhà hàng." />
      {!restaurantId ? (
        <p className="text-sm text-slate-600">Tài khoản chưa được gán nhà hàng.</p>
      ) : configuration.isPending ? (
        <p role="status" className="text-sm text-slate-600">Đang tải cấu hình PayOS…</p>
      ) : configuration.isError ? (
        <div className="space-y-3 rounded-2xl bg-white p-5">
          <p role="alert" className="text-sm text-rose-800">{payOsError(configuration.error)}</p>
          <button type="button" className="btn-secondary" onClick={() => void configuration.refetch()}>
            Thử lại
          </button>
        </div>
      ) : (
        <PaymentMethods
          key={`${user?.userId}:${restaurantId}`}
          restaurantId={restaurantId}
          config={configuration.data}
          onSave={save}
          updateStatus={updateStatus}
          updatingStatus={updatingStatus}
        />
      )}
    </>
  )
}

function PaymentMethods({ restaurantId, config, onSave, updateStatus, updatingStatus }: {
  restaurantId: string
  config: PayOsConfiguration
  onSave: (values: PayOsSettings) => Promise<PayOsConfiguration>
  updateStatus: (enabled: boolean) => Promise<void>
  updatingStatus: boolean
}) {
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled'>('all')
  const [confirmDisable, setConfirmDisable] = useState(false)
  const [editingBusy, setEditingBusy] = useState(false)
  const enabledCount = config.enabled ? 2 : 1
  const filters = [
    { value: 'all', label: 'Tất cả', count: 2 },
    { value: 'enabled', label: 'Đang bật', count: enabledCount },
    { value: 'disabled', label: 'Đang tắt', count: 2 - enabledCount },
  ] as const

  async function changePayOsStatus(enabled: boolean) {
    if (editingBusy || updatingStatus) return
    await updateStatus(enabled)
    setConfirmDisable(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="text-sm font-semibold text-slate-900">Danh sách phương thức</h2>
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium text-slate-600">
          {filters.map(({ value, label, count }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              className="rounded-md px-2.5 py-1 hover:text-slate-900 aria-pressed:bg-white aria-pressed:font-semibold aria-pressed:text-emerald-800 aria-pressed:shadow-sm"
              onClick={() => setFilter(value)}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {filter !== 'disabled' && (
          <PaymentMethodCard
            name="Tiền mặt"
            symbol="₫"
            description="Thu ngân nhận tiền và xác nhận thanh toán tại quầy."
            enabled
            statusLabel="Đang bật"
          />
        )}
        {(filter === 'all' || (filter === 'enabled' ? config.enabled : !config.enabled)) && (
          <PaymentMethodCard
            name="Chuyển khoản PayOS"
            symbol="QR"
            description="Thanh toán bằng mã QR và nhận kết quả giao dịch từ cổng thanh toán."
            enabled={config.enabled}
            disabled={(updatingStatus || editingBusy) || !config.configured}
            disabledReason={!config.configured ? 'Thiết lập kết nối PayOS bên dưới để bật phương thức này.' : undefined}
            onChange={(enabled) => {
              if (enabled) void changePayOsStatus(true)
              else setConfirmDisable(true)
            }}
            statusLabel={updatingStatus ? 'Đang lưu…' : !config.configured ? 'Chưa thể bật' : undefined}
          />
        )}
        {filter === 'disabled' && config.enabled && (
          <p className="text-sm text-slate-500">Không có phương thức nào đang tắt.</p>
        )}
      </div>
      <PayOsSettingsForm
        restaurantId={restaurantId}
        config={config}
        onSave={onSave}
        disabled={updatingStatus}
        onBusyChange={setEditingBusy}
      />
      {confirmDisable && (
        <Modal title="Tắt thanh toán PayOS?" onClose={() => {
          if (!updatingStatus) setConfirmDisable(false)
        }}>
          <div className="space-y-5 p-6">
            <p className="text-sm text-slate-600">
              Khách sẽ không thể chọn chuyển khoản PayOS cho các khoản thanh toán mới.
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className="btn-secondary" disabled={updatingStatus} onClick={() => setConfirmDisable(false)}>
                Giữ PayOS
              </button>
              <button type="button" className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-60" disabled={updatingStatus} onClick={() => void changePayOsStatus(false)}>
                {updatingStatus ? 'Đang tắt…' : 'Tắt PayOS'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
