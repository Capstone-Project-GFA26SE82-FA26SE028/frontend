import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
export function PayOSConnection({
  connected,
  onToggle,
}: {
  connected: boolean
  onToggle: () => void
}) {
  return (
    <Panel className="mt-5 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-900">Kết nối PayOS</h2>
        <Badge tone={connected ? 'green' : 'slate'}>
          {connected ? 'Đã kết nối mẫu' : 'Chưa kết nối'}
        </Badge>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <h3 className="font-medium text-slate-800">
              Thiết lập cổng thanh toán
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Mô phỏng trạng thái kết nối để thử giao diện. Chưa kiểm tra thông
              tin PayOS thật, chưa tạo hoặc nhận giao dịch. Khóa bí mật sẽ do BE
              quản lý.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
            onClick={onToggle}
          >
            {connected ? 'Ngắt kết nối mẫu' : 'Thiết lập kết nối mẫu'}
          </button>
        </div>
        <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
          Kết nối mẫu chỉ phục vụ xem trước giao diện, không thực hiện giao dịch
          thật.
        </p>
      </div>
    </Panel>
  )
}
