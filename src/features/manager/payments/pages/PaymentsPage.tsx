import { useState } from 'react'
import { Badge } from '../../../../components/Badge/Badge'
import { Icon } from '../../../../components/Icon/Icon'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Pagination, PAGE_SIZE } from '../../../../components/Pagination/Pagination'
import { SummaryCards } from '../../../../components/SummaryCards/SummaryCards'
import { PaymentDetail } from '../components/PaymentDetail'
import { previewPayments, type ManagerPayment, type PaymentMethod, type PaymentStatus } from '../data/previewPayments'
import { exportPayments, methodLabels, money, paymentStatus, paymentTime } from '../utils/payments'

export function PaymentsPage() {
  const [search, setSearch] = useState('')
  const [method, setMethod] = useState('')
  const [status, setStatus] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<ManagerPayment | null>(null)
  const term = search.trim().toLocaleLowerCase('vi-VN')
  const invalidRange = !!from && !!to && from > to
  const filtered = previewPayments.filter((payment) => !invalidRange &&
    (!method || payment.method === method) && (!status || payment.status === status) &&
    (!from || payment.createdAt.slice(0, 10) >= from) && (!to || payment.createdAt.slice(0, 10) <= to) &&
    (!term || [payment.id, payment.billNumber, payment.table, payment.cashier, payment.reference ?? ''].some((value) => value.toLocaleLowerCase('vi-VN').includes(term))))
  const paid = filtered.filter((payment) => payment.status === 'Paid')
  const pending = filtered.filter((payment) => payment.status === 'Pending')
  const total = paid.reduce((sum, payment) => sum + payment.amount, 0)
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)))
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const hasFilters = !!(search || method || status || from || to)

  function changeFilter(setter: (value: string) => void, value: string) {
    setter(value)
    setPage(1)
  }

  function reset() {
    setSearch(''); setMethod(''); setStatus(''); setFrom(''); setTo(''); setPage(1)
  }

  return (
    <>
      <PageHeading eyebrow="Dòng tiền nhà hàng" title="Quản lý thanh toán"
        description="Theo dõi giao dịch, kiểm tra trạng thái và đối chiếu các khoản thanh toán của nhà hàng."
        action={<button type="button" className="btn-secondary" disabled={!filtered.length} onClick={() => exportPayments(filtered)}><Icon name="download" size={18} />Xuất CSV</button>} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <div className="flex items-center gap-3"><Icon name="eye" size={19} /><p><span className="font-semibold">Bản xem trước UI</span><span className="mx-2 text-amber-300">/</span>Dữ liệu minh họa ngày 28/11/2026, chưa kết nối giao dịch thực tế.</p></div>
        <Badge tone="amber">12 giao dịch mẫu</Badge>
      </div>

      <SummaryCards items={[
        { label: 'Tổng đã thu', value: money(total), icon: 'coin', note: `${paid.length} giao dịch thành công trong bộ lọc` },
        { label: 'Tiền mặt', value: money(paid.filter((p) => p.method === 'Cash').reduce((sum, p) => sum + p.amount, 0)), icon: 'receipt', note: 'Chỉ tính giao dịch thành công' },
        { label: 'Chuyển khoản PayOS', value: money(paid.filter((p) => p.method === 'BankTransfer').reduce((sum, p) => sum + p.amount, 0)), icon: 'qr', note: 'Chỉ tính giao dịch thành công' },
        { label: 'Chờ thanh toán', value: money(pending.reduce((sum, p) => sum + p.amount, 0)), icon: 'clock', note: `${pending.length} giao dịch chưa hoàn tất` },
      ]} />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white" aria-label="Danh sách giao dịch thanh toán">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-mint text-brand"><Icon name="activity" /></span><div><h2 className="font-bold text-slate-800">Giao dịch thanh toán</h2><p className="mt-1 text-xs text-slate-500">{filtered.length} giao dịch phù hợp · Mới nhất trước</p></div></div>
          <span className="text-xs text-slate-400">Múi giờ Việt Nam (UTC+7)</span>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr]">
            <label className="text-sm font-medium text-slate-600">Tìm giao dịch
              <span className="relative mt-2 block"><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400"><Icon name="search" size={18} /></span><input className="field pl-10" value={search} onChange={(e) => changeFilter(setSearch, e.target.value)} placeholder="Mã giao dịch, hóa đơn, bàn, thu ngân…" /></span>
            </label>
            <label className="text-sm font-medium text-slate-600">Phương thức<select className="field mt-2" value={method} onChange={(e) => changeFilter(setMethod, e.target.value)}><option value="">Tất cả phương thức</option>{(Object.keys(methodLabels) as PaymentMethod[]).map((key) => <option key={key} value={key}>{methodLabels[key]}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-600">Trạng thái<select className="field mt-2" value={status} onChange={(e) => changeFilter(setStatus, e.target.value)}><option value="">Tất cả trạng thái</option>{(Object.keys(paymentStatus) as PaymentStatus[]).map((key) => <option key={key} value={key}>{paymentStatus[key].label}</option>)}</select></label>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <label className="min-w-40 flex-1 text-sm font-medium text-slate-600 sm:max-w-56">Từ ngày<input className="field mt-2" type="date" value={from} aria-invalid={invalidRange} onChange={(e) => changeFilter(setFrom, e.target.value)} /></label>
            <label className="min-w-40 flex-1 text-sm font-medium text-slate-600 sm:max-w-56">Đến ngày<input className="field mt-2" type="date" value={to} aria-invalid={invalidRange} onChange={(e) => changeFilter(setTo, e.target.value)} /></label>
            {hasFilters && <button type="button" className="btn-secondary" onClick={reset}><Icon name="close" size={16} />Xóa bộ lọc</button>}
          </div>
          {invalidRange && <p role="alert" className="text-sm text-rose-700">Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.</p>}
        </div>

        {!visible.length ? (
          <div className="border-t border-slate-100 px-5 py-16 text-center"><span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-slate-50 text-slate-400"><Icon name="search" size={25} /></span><h3 className="font-semibold text-slate-800">Không tìm thấy giao dịch</h3><p className="mt-2 text-sm text-slate-500">Thử tìm bằng mã khác hoặc điều chỉnh khoảng ngày.</p><button type="button" className="btn-secondary mt-5" onClick={reset}>Xóa bộ lọc</button></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Giao dịch / Hóa đơn', 'Thời gian tạo', 'Bàn / Kênh', 'Phương thức', 'Số tiền', 'Trạng thái', 'Thao tác'].map((label) => <th key={label} scope="col" className={`whitespace-nowrap px-5 py-4 font-semibold ${label === 'Số tiền' ? 'text-right' : ''}`}>{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((payment) => (
                  <tr key={payment.id} className="transition-colors hover:bg-emerald-50/40">
                    <td className="whitespace-nowrap px-5 py-4"><p className="font-semibold text-slate-800">{payment.id}</p><p className="mt-1 text-xs text-slate-400">{payment.billNumber}</p></td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">{paymentTime(payment.createdAt)}</td>
                    <td className="whitespace-nowrap px-5 py-4"><p className="font-medium text-slate-700">{payment.table}</p><p className="mt-1 text-xs text-slate-400">{payment.channel === 'DineIn' ? 'Tại nhà hàng' : 'Đơn mang đi'}</p></td>
                    <td className="whitespace-nowrap px-5 py-4"><span className="flex items-center gap-2 text-slate-600"><Icon name={payment.method === 'Cash' ? 'coin' : 'qr'} size={17} />{payment.method === 'Cash' ? 'Tiền mặt' : 'PayOS'}</span></td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums text-slate-800">{money(payment.amount)}</td>
                    <td className="px-5 py-4"><Badge tone={paymentStatus[payment.status].tone}><span className="size-1.5 rounded-full bg-current" />{paymentStatus[payment.status].label}</Badge></td>
                    <td className="px-5 py-4"><button type="button" className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm font-semibold text-brand hover:bg-mint" aria-label={`Xem giao dịch ${payment.id}`} onClick={() => setSelected(payment)}>Chi tiết<Icon name="chevron" size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination total={filtered.length} page={currentPage} onPage={setPage} />
      </section>
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><Icon name="shield" size={15} />Tổng đã thu chỉ bao gồm giao dịch thành công. Giao dịch chờ, thất bại và đã hủy không được tính vào số tiền đã thu.</p>
      {selected && <PaymentDetail payment={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
