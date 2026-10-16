import { useEffect, useState } from 'react'
import { Icon } from '../../../../components/Icon/Icon'
import { Modal } from '../../../../components/Modal/Modal'

export function ServiceRequestButton() {
  const [help, setHelp] = useState(false)
  const [sent, setSent] = useState('')
  const [cooldown, setCooldown] = useState(0)
  useEffect(() => {
    if (!cooldown) return
    const timer = window.setInterval(
      () => setCooldown((v) => Math.max(0, v - 1)),
      1000,
    )
    return () => clearInterval(timer)
  }, [cooldown])
  return (
    <>
      <button
        onClick={() => {
          setHelp(true)
          setSent('')
        }}
        className="btn-secondary min-h-11 gap-2 whitespace-nowrap px-3 text-xs sm:px-4 sm:text-sm"
      >
        <Icon name="service" size={18} className="hidden sm:block" />
        <span>Gọi phục vụ</span>
        
      </button>
      {help && (
        <Modal title="Mộc luôn sẵn sàng hỗ trợ" onClose={() => setHelp(false)}>
          <div className="space-y-4 p-6">
            <p className="text-sm text-muted">
              Bạn cần gì cho bàn 08? Chọn một yêu cầu bên dưới nhé.
            </p>
            {[
              'Gọi nhân viên phục vụ',
              'Thêm nước lọc',
              'Thêm đũa, thìa',
              'Yêu cầu thanh toán',
            ].map((label) => (
              <button
                key={label}
                disabled={cooldown > 0}
                className="btn-secondary w-full justify-between"
                onClick={() => {
                  setSent(
                    `Bạn đã chọn “${label}”. Vui lòng báo nhân viên tại bàn để được hỗ trợ.`,
                  )
                  setCooldown(30)
                }}
              >
                {label}
                <Icon name="arrow" size={16} />
              </button>
            ))}
            {sent && (
              <p
                role="status"
                className="rounded-xl bg-mint p-4 text-sm leading-6 text-brand"
              >
                {sent}
              </p>
            )}
            {cooldown > 0 && (
              <p className="text-xs text-muted">
                Bạn có thể gửi yêu cầu tiếp sau {cooldown} giây.
              </p>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
