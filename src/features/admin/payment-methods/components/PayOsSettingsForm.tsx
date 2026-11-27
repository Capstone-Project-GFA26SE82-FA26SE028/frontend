import { PayOsTestQrModal } from './PayOsTestQrModal'
import { useRef, useState } from 'react'
import { toDataURL } from 'qrcode'
import { Icon } from '../../../../components/Icon/Icon'
import { Panel } from '../../../../components/Panel/Panel'
import { payOsError, testPayOsConnection } from '../api/payOsApi'
import { payOsCredentialsSchema, payOsSettingsSchema } from '../schemas/payOsSchema'
import type { PayOsConfiguration, PayOsSettings, PayOsTestQr } from '../types/types'

function initialValues(config: PayOsConfiguration): PayOsSettings {
  return {
    clientId: config.clientId ?? '',
    apiKey: '',
    checksumKey: '',
    returnUrl: config.returnUrl ?? '',
    cancelUrl: config.cancelUrl ?? '',
    enabled: config.enabled,
  }
}

export function PayOsSettingsForm({
  restaurantId,
  config,
  onSave,
  disabled,
  onBusyChange,
}: {
  restaurantId: string
  config: PayOsConfiguration
  onSave: (values: PayOsSettings) => Promise<PayOsConfiguration>
  disabled: boolean
  onBusyChange: (busy: boolean) => void
}) {
  const [values, setValues] = useState(() => initialValues(config))
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState<'save' | 'test' | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [qrMode, setQrMode] = useState<'test' | 'test-saved'>('test')
  const [showQr, setShowQr] = useState(false)
  const [qrError, setQrError] = useState('')
  const [qr, setQr] = useState<(PayOsTestQr & { image: string }) | null>(null)
  const lock = useRef(false)

  async function run(action: 'save' | 'test' | 'test-saved') {
    if (lock.current || disabled) return
    setError('')
    setNotice('')
    setQr(null)
    let request: Parameters<typeof testPayOsConnection>[1] = { useSavedConfiguration: true }
    if (action !== 'test-saved') {
      const credentials = payOsCredentialsSchema.safeParse(values)
      if (!credentials.success) {
        setError(credentials.error.issues[0]?.message ?? 'Thông tin PayOS không hợp lệ.')
        return
      }
      const { apiKey, checksumKey } = credentials.data
      const needsKeys = action === 'test' || !config.configured
      if ((needsKeys && (!apiKey || !checksumKey)) || (!!apiKey !== !!checksumKey)) {
        setError('Nhập đầy đủ API Key và Checksum Key.')
        return
      }
      request = credentials.data
    }

    if (action !== 'save') {
      setQrMode(action)
      setQrError('')
      setShowQr(true)
    }
    lock.current = true
    setBusy(action === 'save' ? 'save' : 'test')
    onBusyChange(true)
    try {
      if (action === 'save') {
        const parsed = payOsSettingsSchema.safeParse({ ...values, enabled: config.enabled })
        if (!parsed.success) throw new Error('Đường dẫn quay lại hoặc hủy tối đa 2048 ký tự.')
        const saved = await onSave(parsed.data)
        setValues({ ...initialValues(saved), apiKey: parsed.data.apiKey, checksumKey: parsed.data.checksumKey })
        setEditing(false)
        setNotice('Đã lưu cấu hình PayOS.')
      } else {
        const result = await testPayOsConnection(restaurantId, request)
        if (!result.qrCode) throw new Error('PayOS chưa trả về mã QR.')
        setQr({ ...result, image: await toDataURL(result.qrCode, { width: 240, margin: 2 }) })
      }
    } catch (cause) {
      if (action !== 'save') setQrError(payOsError(cause))
      else setError(payOsError(cause))
    } finally {
      lock.current = false
      setBusy(null)
      onBusyChange(false)
    }
  }

  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-700">QR</span>
          <h2 className="text-lg font-semibold">Cổng thanh toán PayOS</h2>
          <span className="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            {config.configured ? 'Đã kết nối' : 'Chưa cấu hình'}
          </span>
        </div>
          <div className="space-y-5 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div className="min-w-0 max-w-xl space-y-3">
                <h3 className="font-semibold">Thiết lập kết nối cổng thanh toán</h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  Cổng thanh toán tạo mã VietQR theo từng hóa đơn và xác nhận giao dịch theo thời gian thực.
                </p>
                {config.configured && (
                  <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                    <dt className="text-slate-500">Client ID</dt>
                    <dd className="break-all text-right font-mono font-semibold">{config.clientId}</dd>
                    <dt className="text-slate-500">API Key</dt>
                    <dd className="text-right font-mono text-emerald-700">••••••••••••</dd>
                    <dt className="text-slate-500">Checksum Key</dt>
                    <dd className="text-right font-mono text-emerald-700">••••••••••••</dd>
                  </dl>
                )}
              </div>
              <div className="flex flex-wrap items-start gap-2 lg:shrink-0">
                {config.configured && (
                  <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 disabled:opacity-60" disabled={disabled || !!busy} onClick={() => void run('test-saved')}>
                    <Icon name="qr" size={16} />
                    {busy === 'test' ? 'Đang tạo…' : 'Tạo mã QR kiểm tra kết nối'}
                  </button>
                )}
                <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60" disabled={disabled || !!busy} onClick={() => {
                  setError('')
                  setNotice('')
                  setEditing(!editing)
                }}>
                  <Icon name="settings" size={16} />
                  {editing ? 'Đóng cấu hình' : config.configured ? 'Sửa cấu hình' : 'Nhập thông tin PayOS'}
                </button>
              </div>
            </div>
            {!editing && error && <p role="alert" className="text-sm text-rose-800">{error}</p>}
            {notice && <p role="status" className="text-sm text-emerald-800">{notice}</p>}
            {editing && (
              <form className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6" onSubmit={(event) => {
                event.preventDefault()
                void run('save')
              }}>
                <h3 className="border-b border-slate-200 pb-3 text-sm font-semibold text-slate-800">Thông số tích hợp PayOS</h3>
                <fieldset disabled={disabled || !!busy} className="grid gap-4 sm:grid-cols-2">
                  {([
                    ['clientId', 'Client ID', 'text'],
                    ['apiKey', 'API Key', 'password'],
                    ['checksumKey', 'Checksum Key', 'password'],
                  ] as const).map(([key, label, type]) => (
                    <label key={key} className={key === 'clientId' ? 'sm:col-span-2' : undefined}>
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                      <input
                        type={type}
                        autoComplete={type === 'password' ? 'new-password' : 'off'}
                        spellCheck={false}
                        className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-emerald-600 focus:outline-none"
                        placeholder={key === 'clientId' ? 'Nhập Client ID từ PayOS' : config.configured ? 'Để trống để giữ khóa hiện tại' : 'Nhập khóa từ PayOS'}
                        value={values[key]}
                        onChange={(event) => {
                          setValues({ ...values, [key]: event.target.value })
                          setError('')
                          setNotice('')
                          setQr(null)
                        }}
                      />
                    </label>
                  ))}
                </fieldset>
                {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
                {notice && <p role="status" className="text-sm text-emerald-800">{notice}</p>}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-3">
                  <button type="button" className="btn-secondary" disabled={disabled || !!busy} onClick={() => {
                    setEditing(false)
                    setError('')
                  }}>
                    Hủy
                  </button>
                  <button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50" disabled={disabled || !!busy} onClick={() => void run('test')}>
                    <Icon name="refresh" size={15} />
                    {busy === 'test' ? 'Đang kiểm tra…' : 'Kiểm tra kết nối'}
                  </button>
                  <button type="submit" className="btn-primary" disabled={disabled || !!busy}>
                    {busy === 'save' ? 'Đang lưu…' : 'Xác nhận cấu hình PayOS'}
                  </button>
                </div>
              </form>
            )}
            <details className="rounded-xl border border-slate-200 bg-slate-50">
              <summary className="cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold text-slate-800">
                Hướng dẫn kết nối PayOS
              </summary>
              <ol className="list-decimal space-y-2 border-t border-slate-200 py-3 pl-9 pr-4 text-sm text-slate-600">
                <li>Đăng nhập vào PayOS, chọn kênh thanh toán của nhà hàng và sao chép <strong>Client ID</strong>, <strong>API Key</strong> và <strong>Checksum Key</strong>.</li>
                <li>Bấm <strong>Nhập thông tin PayOS</strong> hoặc <strong>Sửa cấu hình</strong>, rồi điền ba thông tin vừa sao chép.</li>
                <li>Bấm <strong>Kiểm tra kết nối</strong>. Khi mã QR thử xuất hiện, kiểm tra thông tin người nhận. Bạn có thể quét mã bằng ứng dụng ngân hàng mà không cần chuyển tiền.</li>
                <li>Đóng hộp thoại QR, bấm <strong>Xác nhận cấu hình PayOS</strong>, rồi bật <strong>Chuyển khoản PayOS</strong>.</li>
              </ol>
            </details>
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Lưu ý: Chỉ bật phương thức Chuyển khoản PayOS khi cổng thanh toán đã được kết nối hợp lệ.
            </p>
          </div>
      </Panel>
      {showQr && (
        <PayOsTestQrModal
          qr={qr}
          loading={busy === 'test'}
          qrError={qrError}
          onClose={() => setShowQr(false)}
          onEdit={() => {
            setShowQr(false)
            setEditing(true)
          }}
          onRetry={() => void run(qrMode)}
        />
      )}
    </div>
  )
}
