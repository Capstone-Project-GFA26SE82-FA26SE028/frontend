import { useState, useEffect } from 'react'
import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'
import { toast } from 'react-toastify'
import {
  updatePayOsConfig,
  getPayOsConfig,
  testPayOsQr,
  type TestPayOsQrResult,
} from '../api/paymentSettingsApi'
import type { PayOsConfig } from '../schema'

const defaultReturnUrl =
  typeof window !== 'undefined'
    ? `${window.location.origin}/payment/success`
    : 'http://localhost:5173/payment/success'
const defaultCancelUrl =
  typeof window !== 'undefined'
    ? `${window.location.origin}/payment/cancel`
    : 'http://localhost:5173/payment/cancel'

const BANK_BIN_MAP: Record<string, string> = {
  '970422': 'MB Bank (Quân Đội)',
  '970436': 'Vietcombank',
  '970415': 'VietinBank',
  '970418': 'BIDV',
  '970407': 'Techcombank',
  '970416': 'ACB',
  '970423': 'TPBank',
  '970432': 'VPBank',
  '970405': 'Agribank',
  '970441': 'VIB',
  '970403': 'Sacombank',
  '970448': 'OCB',
}

type PayOSConnectionProps = {
  restaurantId?: string
  config?: PayOsConfig
  onUpdateConfig: (config: PayOsConfig) => void
}

export function PayOSConnection({
  restaurantId,
  config,
  onUpdateConfig,
}: PayOSConnectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [showKeys, setShowKeys] = useState(false)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showTestModal, setShowTestModal] = useState(false)
  const [testQrLoading, setTestQrLoading] = useState(false)
  const [testQrData, setTestQrData] = useState<TestPayOsQrResult | null>(null)
  const [testQrError, setTestQrError] = useState<string | null>(null)
  const [testFeedback, setTestFeedback] = useState<{
    success: boolean
    title: string
    description: string
  } | null>(null)

  const [form, setForm] = useState<PayOsConfig>(() => ({
    clientId: config?.clientId || '',
    apiKey: config?.apiKey || '',
    checksumKey: config?.checksumKey || '',
    returnUrl: config?.returnUrl || defaultReturnUrl,
    cancelUrl: config?.cancelUrl || defaultCancelUrl,
    webhookUrl: config?.webhookUrl || '',
    enabled: config?.enabled ?? false,
    configured: config?.configured ?? false,
  }))

  // Try loading real config from backend if restaurantId is provided
  useEffect(() => {
    if (!restaurantId) return
    let active = true
    // Clean up any legacy localStorage entry
    try {
      localStorage.removeItem(`payos_keys_${restaurantId}`)
    } catch {}

    getPayOsConfig(restaurantId)
      .then((res) => {
        if (!active) return
        setForm((prev) => ({
          ...prev,
          clientId: res.clientId || prev.clientId,
          returnUrl: res.returnUrl || prev.returnUrl,
          cancelUrl: res.cancelUrl || prev.cancelUrl,
          webhookUrl: res.webhookUrl || prev.webhookUrl,
          enabled: res.enabled,
          configured: res.configured,
        }))
        if (res.configured) {
          onUpdateConfig({
            clientId: res.clientId,
            apiKey: config?.apiKey || '',
            checksumKey: config?.checksumKey || '',
            returnUrl: res.returnUrl,
            cancelUrl: res.cancelUrl,
            webhookUrl: res.webhookUrl,
            enabled: res.enabled,
            configured: res.configured,
          })
        }
      })
      .catch(() => {
        // Fall back quietly
      })
    return () => {
      active = false
    }
  }, [restaurantId, config?.apiKey, config?.checksumKey, onUpdateConfig])

  const isConfigured = Boolean(form.configured || form.clientId)

  const handleToggleForm = () => {
    if (!showForm && config) {
      setForm((prev) => ({
        ...prev,
        ...config,
      }))
    }
    setShowForm((prev) => !prev)
  }

  const handleOpenTestQr = async () => {
    const clientId = (form.clientId || config?.clientId || '').trim()
    const apiKey = (form.apiKey || config?.apiKey || '').trim()
    const checksumKey = (form.checksumKey || config?.checksumKey || '').trim()

    if (!clientId || !apiKey || !checksumKey) {
      toast.info('Vui lòng mở "Sửa cấu hình" và nhập API Key, Checksum Key để tạo mã QR thử nghiệm trực tiếp từ PayOS.')
      setShowForm(true)
      return
    }

    setShowTestModal(true)
    setTestQrLoading(true)
    setTestQrError(null)
    setTestQrData(null)

    if (restaurantId) {
      try {
        const result = await testPayOsQr(restaurantId, { clientId, apiKey, checksumKey })
        setTestQrData(result)
        toast.success('Đã tạo mã QR PayOS thử nghiệm thành công!')
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Lỗi kết nối PayOS.'
        setTestQrError(msg)
      } finally {
        setTestQrLoading(false)
      }
    } else {
      setTestQrLoading(false)
      setTestQrError('Cần kết nối với nhà hàng trên hệ thống để gọi cổng PayOS.')
    }
  }

  const handleTestConnection = async () => {
    const clientId = (form.clientId || '').trim()
    const apiKey = (form.apiKey || '').trim()
    const checksumKey = (form.checksumKey || '').trim()

    if (!clientId || !apiKey || !checksumKey) {
      setTestFeedback({
        success: false,
        title: 'Chưa đủ thông tin kiểm tra',
        description:
          'Vui lòng nhập đầy đủ cả 3 thông tin: Client ID, API Key và Checksum Key để gửi yêu cầu xác thực tới cổng PayOS.',
      })
      toast.error('Vui lòng nhập đầy đủ Client ID, API Key và Checksum Key trước khi kiểm tra.')
      return
    }

    if (clientId.length < 8) {
      setTestFeedback({
        success: false,
        title: 'Client ID không hợp lệ',
        description: 'Client ID quá ngắn hoặc không đúng định dạng từ PayOS.',
      })
      toast.error('Client ID không đúng định dạng.')
      return
    }

    if (apiKey.length < 8) {
      setTestFeedback({
        success: false,
        title: 'API Key không hợp lệ',
        description: 'API Key quá ngắn hoặc không đúng định dạng từ PayOS.',
      })
      toast.error('API Key không đúng định dạng.')
      return
    }

    if (checksumKey.length !== 64 || !/^[0-9a-fA-F]+$/.test(checksumKey)) {
      setTestFeedback({
        success: false,
        title: 'Checksum Key không đúng định dạng',
        description:
          'Khóa kiểm tra (Checksum Key) của PayOS bắt buộc phải gồm đúng 64 ký tự hex. Vui lòng sao chép lại từ Bảng điều khiển PayOS.',
      })
      toast.error('Checksum Key không đúng 64 ký tự hex.')
      return
    }

    if (!restaurantId) {
      setTestFeedback({
        success: false,
        title: 'Không thể kiểm tra kết nối',
        description: 'Chưa xác định được nhà hàng để gửi yêu cầu kiểm tra tới PayOS.',
      })
      toast.error('Chưa xác định được nhà hàng để kiểm tra kết nối.')
      return
    }

    setTesting(true)
    setTestFeedback(null)

    try {
      const result = await testPayOsQr(restaurantId, { clientId, apiKey, checksumKey })
      setTestFeedback({
        success: true,
        title: 'Xác thực cổng PayOS thành công!',
        description: `Đã kết nối trực tiếp đến PayOS. Tài khoản nhận tiền: ${result.accountName || 'Chủ tài khoản'} (${result.bin && BANK_BIN_MAP[result.bin] ? BANK_BIN_MAP[result.bin] : (result.bin || '')} - STK: ${result.accountNumber || ''}).`,
      })
      toast.success('Kết nối PayOS hợp lệ và sẵn sàng hoạt động!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối PayOS.'
      setTestFeedback({
        success: false,
        title: 'Kết nối PayOS thất bại',
        description: msg,
      })
      toast.error(msg)
    } finally {
      setTesting(false)
    }
  }

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedClient = form.clientId.trim()
    const trimmedApi = form.apiKey.trim()
    const trimmedChecksum = form.checksumKey.trim()

    if (!trimmedClient) {
      toast.error('Vui lòng nhập Client ID.')
      return
    }

    if (!isConfigured && (!trimmedApi || !trimmedChecksum)) {
      toast.error('Vui lòng nhập đầy đủ Client ID, API Key và Checksum Key khi cấu hình lần đầu.')
      return
    }

    setLoading(true)
    const effectiveReturnUrl = form.returnUrl.trim() || defaultReturnUrl
    const effectiveCancelUrl = form.cancelUrl.trim() || defaultCancelUrl

    const finalApiKey = trimmedApi || form.apiKey || config?.apiKey || ''
    const finalChecksumKey = trimmedChecksum || form.checksumKey || config?.checksumKey || ''

    const updatedConfig: PayOsConfig = {
      ...form,
      clientId: trimmedClient,
      apiKey: finalApiKey,
      checksumKey: finalChecksumKey,
      returnUrl: effectiveReturnUrl,
      cancelUrl: effectiveCancelUrl,
      configured: true,
      enabled: form.enabled,
    }

    if (restaurantId) {
      try {
        await updatePayOsConfig(restaurantId, {
          clientId: trimmedClient,
          apiKey: trimmedApi,
          checksumKey: trimmedChecksum,
          returnUrl: effectiveReturnUrl,
          cancelUrl: effectiveCancelUrl,
          enabled: form.enabled,
        })
        toast.success('Đã lưu cấu hình PayOS lên máy chủ thành công.')
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ.'
        toast.warn(`Không thể đồng bộ máy chủ (${msg}). Đã lưu cục bộ.`)
      }
    } else {
      toast.success('Đã cập nhật cấu hình PayOS thành công.')
    }

    setLoading(false)
    setShowForm(false)
    onUpdateConfig(updatedConfig)
  }

  return (
    <Panel className="mt-5 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-700">
            QR
          </span>
          <h2 className="text-lg font-semibold text-slate-900">
            Cổng thanh toán PayOS
          </h2>
        </div>
        <Badge tone={isConfigured ? 'green' : 'slate'}>
          {isConfigured ? 'Đã kết nối' : 'Chưa kết nối'}
        </Badge>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-xl">
            <h3 className="font-medium text-slate-800">
              Thiết lập kết nối cổng thanh toán
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Cổng thanh toán tự động tạo mã VietQR theo từng hóa đơn và xác nhận
              giao dịch qua Webhook theo thời gian thực.
            </p>
            {form.clientId && (
              <div className="mt-3 space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Client ID:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {form.clientId}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">API Key:</span>
                  <span className="font-mono font-medium text-emerald-700">
                    •••••••••••••••••••••••••••••••• (Đã lưu & bảo mật)
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Checksum Key:</span>
                  <span className="font-mono font-medium text-emerald-700">
                    •••••••••••••••••••••••••••••••• (Đã lưu & bảo mật)
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isConfigured && (
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                onClick={handleOpenTestQr}
              >
                <Icon name="qr" size={16} />
                Tạo mã QR kiểm tra kết nối
              </button>
            )}
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              onClick={handleToggleForm}
            >
              <Icon name="settings" size={16} />
              {showForm ? 'Đóng cấu hình' : isConfigured ? 'Sửa cấu hình' : 'Nhập thông tin PayOS'}
            </button>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSaveForm}
            className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6"
          >
            <div className="border-b border-slate-200 pb-3">
              <h4 className="text-sm font-semibold text-slate-800">
                Thông số tích hợp PayOS
              </h4>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Client ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.clientId}
                  onChange={(e) => {
                    setForm({ ...form, clientId: e.target.value })
                    if (testFeedback) setTestFeedback(null)
                  }}
                  placeholder="Nhập Client ID từ bảng điều khiển PayOS"
                  className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    API Key {!isConfigured && <span className="text-rose-500">*</span>}
                  </label>
                  {form.apiKey && (
                    <button
                      type="button"
                      tabIndex={-1}
                      className="text-xs text-slate-500 hover:text-slate-800"
                      onClick={() => setShowKeys(!showKeys)}
                    >
                      {showKeys ? 'Ẩn' : 'Hiện'}
                    </button>
                  )}
                </div>
                <input
                  type={showKeys ? 'text' : 'password'}
                  required={!isConfigured}
                  value={form.apiKey}
                  onChange={(e) => {
                    setForm({ ...form, apiKey: e.target.value })
                    if (testFeedback) setTestFeedback(null)
                  }}
                  placeholder={
                    isConfigured
                      ? '•••••••••••••••• (Đã lưu - để trống nếu không đổi)'
                      : 'Nhập API Key từ PayOS'
                  }
                  className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Checksum Key {!isConfigured && <span className="text-rose-500">*</span>}
                </label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  required={!isConfigured}
                  value={form.checksumKey}
                  onChange={(e) => {
                    setForm({ ...form, checksumKey: e.target.value })
                    if (testFeedback) setTestFeedback(null)
                  }}
                  placeholder={
                    isConfigured
                      ? '•••••••••••••••• (Đã lưu - để trống nếu không đổi)'
                      : 'Nhập Checksum Key (64 ký tự)'
                  }
                  className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {isConfigured && (
              <p className="rounded-lg bg-emerald-50/70 px-3 py-2 text-[11px] leading-relaxed text-emerald-800">
                 <strong>Bảo mật:</strong> API Key và Checksum Key đã được mã hóa an toàn trên máy chủ. Bạn chỉ cần nhập lại khi muốn thay đổi sang khóa mới.
              </p>
            )}

            {testFeedback && (
              <div
                className={`rounded-xl border p-3.5 text-xs ${
                  testFeedback.success
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-rose-200 bg-rose-50 text-rose-800'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Icon name={testFeedback.success ? 'check' : 'ban'} size={16} />
                  <span>{testFeedback.title}</span>
                </div>
                <p className="mt-1 pl-6 text-[11px] leading-relaxed">
                  {testFeedback.description}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-3 pt-3">
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                onClick={() => {
                  setShowForm(false)
                  setTestFeedback(null)
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={testing || loading}
                onClick={handleTestConnection}
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
              >
                <Icon name="refresh" size={15} className={testing ? 'animate-spin' : ''} />
                {testing ? 'Đang kiểm tra…' : 'Kiểm tra kết nối'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {loading ? 'Đang lưu…' : 'Xác nhận cấu hình PayOS'}
              </button>
            </div>
          </form>
        )}

        <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
          Lưu ý: Chỉ bật được phương thức Chuyển khoản PayOS khi cổng thanh toán đã được kết nối hợp lệ.
        </p>
      </div>

      {showTestModal && (
        <Modal
          title="Kiểm tra kết nối PayOS thực tế"
          subtitle="Tạo mã thanh toán trực tiếp từ PayOS bằng 3 mã khóa của quán"
          onClose={() => setShowTestModal(false)}
        >
          <div className="space-y-5 p-6 text-slate-700">
            {testQrLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icon name="refresh" size={36} className="animate-spin text-emerald-700" />
                <p className="mt-4 text-sm font-bold text-slate-800">
                  Đang gọi cổng PayOS để tạo mã thanh toán theo 3 key...
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  PayOS đang xác thực Client ID, API Key và tạo mã VietQR cho quán.
                </p>
              </div>
            ) : testQrError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <Icon name="ban" size={24} />
                </div>
                <h4 className="mt-3 font-semibold text-rose-900">
                  PayOS từ chối tạo mã thanh toán
                </h4>
                <p className="mt-1.5 text-xs font-medium text-rose-700">{testQrError}</p>
                <div className="mt-4 rounded-xl border border-rose-100 bg-white p-3 text-left text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">Nguyên nhân có thể do:</p>
                  <ul className="mt-1.5 list-inside list-disc space-y-1 text-slate-600">
                    <li>Client ID hoặc API Key bị gõ sai ký tự hoặc không tồn tại.</li>
                    <li>Checksum Key không khớp với kênh thanh toán trên PayOS.</li>
                    <li>Kênh thanh toán trên PayOS chưa được kích hoạt hoặc đang bị tạm khóa.</li>
                  </ul>
                </div>
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTestModal(false)
                      setShowForm(true)
                    }}
                    className="rounded-xl bg-rose-700 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-800"
                  >
                    Kiểm tra và sửa lại 3 mã khóa
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenTestQr}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            ) : testQrData ? (
              <>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-center">
                  <div className="mx-auto flex size-60 items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm">
                    {testQrData.qrCode ? (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                          testQrData.qrCode,
                        )}`}
                        alt="Mã QR PayOS Thực tế"
                        className="size-full object-contain"
                      />
                    ) : (
                      <p className="text-xs text-slate-500">Không nhận được chuỗi QR từ PayOS</p>
                    )}
                  </div>
                  <p className="mt-3 text-xs font-semibold text-slate-800">
                    Mã VietQR do PayOS sinh theo 3 key của quán
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Số tiền:{' '}
                    <span className="font-bold text-emerald-800">
                      {testQrData.amount?.toLocaleString('vi-VN')} ₫
                    </span>
                  </p>

                  <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-white p-3.5 text-left text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Tên chủ tài khoản:</span>
                      <span className="font-bold uppercase text-slate-900">
                        {testQrData.accountName || 'Đang cập nhật từ PayOS'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Số tài khoản:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {testQrData.accountNumber || 'Đang cập nhật'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Ngân hàng thụ hưởng:</span>
                      <span className="font-semibold text-slate-800">
                        {testQrData.bin && BANK_BIN_MAP[testQrData.bin]
                          ? `${BANK_BIN_MAP[testQrData.bin]} (${testQrData.bin})`
                          : (testQrData.bin || 'N/A')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mã đơn PayOS:</span>
                      <span className="font-mono text-slate-700">{testQrData.orderCode}</span>
                    </div>
                  </div>

                  {testQrData.checkoutUrl && (
                    <div className="mt-3">
                      <a
                        href={testQrData.checkoutUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:underline"
                      >
                        <span>Mở trực tiếp trang thanh toán PayOS</span>
                        <Icon name="arrow" size={14} />
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-900">
                  <div className="flex items-center gap-2 font-semibold">
                    <Icon name="spark" size={16} className="text-emerald-700" />
                    <span>Cách kiểm tra thực tế trên điện thoại:</span>
                  </div>
                  <ol className="list-inside list-decimal space-y-1.5 pl-1 text-[12px] leading-relaxed text-emerald-800">
                    <li>
                      Mở app ngân hàng bất kỳ trên điện thoại (Vietcombank, MB, Techcombank, VPBank,...).
                    </li>
                    <li>
                      Quét mã QR phía trên: Ứng dụng ngân hàng sẽ tự động hiện đúng{' '}
                      <strong>Tên tài khoản quán</strong> và ngân hàng của bạn.
                    </li>
                    <li>
                      <em>
                        (Không cần chuyển tiền thật. App ngân hàng hiện đúng tên tài khoản là 100% kết nối thành công).
                      </em>
                    </li>
                  </ol>
                </div>
              </>
            ) : null}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowTestModal(false)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Panel>
  )
}
