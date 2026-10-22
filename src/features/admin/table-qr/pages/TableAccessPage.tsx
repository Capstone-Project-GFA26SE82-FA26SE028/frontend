import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
export function TableAccessPage() {
  const { token } = useParams()
  const tables = useAppSelector((s) => s.adminTables)
  const areas = useAppSelector((s) => s.adminAreas)
  const table = tables.find(
    (t) =>
      t.token === token &&
      t.active &&
      areas.some((a) => a.id === t.areaId && a.active),
  )
  return (
    <main className="flex min-h-dvh items-center justify-center bg-emerald-50 p-5">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
          FoodHub
        </p>
        <h1 className="mt-5 text-2xl font-bold text-slate-800">
          {table ? table.name : 'Mã QR không còn hiệu lực'}
        </h1>
        <p className="my-5 text-sm leading-7 text-slate-500">
          {table
            ? table.busy
              ? 'Bàn đang có phiên phục vụ. Nhập số điện thoại để tiếp tục.'
              : 'Bàn chưa mở phiên phục vụ. Vui lòng liên hệ nhân viên.'
            : 'Mã đã được thay thế hoặc không tồn tại trong dữ liệu mẫu của trình duyệt này.'}
        </p>
        {table?.busy && (
          <Link
            className="inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white"
            to={
              '/welcome?table=' +
              encodeURIComponent(table.code) +
              '&token=' +
              encodeURIComponent(token || '')
            }
          >
            Nhập số điện thoại
          </Link>
        )}
        <p className="mt-6 text-xs text-slate-400">
          Bản xem trước trên trình duyệt · Chưa kết nối máy chủ
        </p>
      </section>
    </main>
  )
}
