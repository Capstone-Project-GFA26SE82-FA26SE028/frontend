import { useState, type FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useAppSelector } from '../../../../app/hooks'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Panel } from '../../../../components/Panel/Panel'
import { getReport, type Totals } from '../api/reportApi'
import { reportTime } from '../utils/reportTime'
import { DishChart, SalesCharts } from '../components/ReportCharts'
import { reportPreset, type ReportPreset } from '../utils/reportPreset'
import { Icon } from '../../../../components/Icon/Icon'

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})
const metrics = {
  collections: 'Đã thu',
  refunds: 'Đã hoàn',
  netCollections: 'Thực thu ròng',
  dishRevenue: 'Doanh thu món',
  netDishRevenue: 'Doanh thu món ròng',
  discounts: 'Giảm giá',
  vat: 'VAT',
  serviceFees: 'Phí dịch vụ',
  roundingAdjustment: 'Làm tròn',
} as const
const input =
  'block min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3'
const table =
  'w-full text-left text-sm [&_th]:bg-slate-50 [&_td]:border-t [&_td]:border-slate-100 [&_th]:p-3 [&_td]:p-3'
function amount(value: Totals['collections']) {
  return money.format(value.amount ?? value.knownAmount)
}
function errorText(error: unknown) {
  if (isAxiosError(error) && error.response?.data?.message)
    return String(error.response.data.message)
  return error instanceof Error ? error.message : 'Không thể tải báo cáo.'
}
export function ReportsPage() {
  const user = useAppSelector((s) => s.auth.session?.user)
  return (
    <ReportWorkspace
      key={user?.userId + ':' + user?.restaurantId}
      restaurantId={user?.restaurantId || ''}
      userId={user?.userId || ''}
    />
  )
}
function ReportWorkspace({
  restaurantId,
  userId,
}: {
  restaurantId: string
  userId: string
}) {
  const [range, setRange] = useState(() => reportPreset('month'))
  const [preset, setPreset] = useState<ReportPreset | null>('month')
  const [params, setParams] = useState<{
    from: string
    to: string
    groupBy: string
    channel: string
    methodCode: string
    shift: string
  }>(() => {
    const initial = reportPreset('month')
    return { from: reportTime(initial.from), to: reportTime(initial.to), groupBy: 'day', channel: 'all', methodCode: 'all', shift: 'all' }
  })
  const [formError, setFormError] = useState('')
  const key = ['manager-reports', userId, restaurantId, params]
  const period = useQuery({
    queryKey: [...key, 'period'],
    enabled: !!restaurantId && !!params,
    retry: false,
    queryFn: ({ signal }) =>
      getReport(
        restaurantId,
        'period',
        { from: params!.from, to: params!.to, groupBy: params!.groupBy },
        signal,
      ),
  })
  const sales = useQuery({
    queryKey: [...key, 'sales'],
    enabled: period.isSuccess,
    retry: false,
    queryFn: ({ signal }) => getReport(restaurantId, 'sales', params!, signal),
  })
  const dishes = useQuery({
    queryKey: [...key, 'dishes'],
    enabled: period.isSuccess,
    retry: false,
    queryFn: ({ signal }) => getReport(restaurantId, 'dishes', params!, signal),
  })
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const read = (name: string) => String(data.get(name) || '').trim()
    const from = read('from')
    const to = read('to')
    if (!from || !to || from >= to) {
      setFormError('Mốc kết thúc phải sau mốc bắt đầu.')
      return
    }
    setFormError('')
    setParams({
      from: reportTime(from),
      to: reportTime(to),
      groupBy: read('groupBy'),
      channel: read('channel'),
      methodCode: read('methodCode'),
      shift: read('shift') || 'all',
    })
  }
  const warnings = [
    ...new Set(
      [...(sales.data?.warnings || []), ...(dishes.data?.warnings || [])].map(
        (w) => w.message,
      ),
    ),
  ]
  return (
    <>
      <PageHeading
        title="Báo cáo nhà hàng"
        description="Xem doanh thu, dòng tiền và hiệu quả bán từng món theo kỳ."
      />
      <Panel className="mb-5 p-4">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Icon name="calendar" size={18} /> Kỳ báo cáo</div>
          <div className="flex flex-wrap gap-1 rounded-2xl bg-slate-100 p-1">
            {([['today', 'Hôm nay'], ['7d', '7 ngày'], ['month', 'Tháng này'], ['year', 'Năm nay']] as const).map(([key, label]) => (
              <button key={key} type="button" aria-pressed={preset === key} className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${preset === key ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`} onClick={() => {
                const next = reportPreset(key)
                setRange(next)
                setPreset(key)
                setFormError('')
                setParams({ ...params, from: reportTime(next.from), to: reportTime(next.to) })
              }}>{label}</button>
            ))}
          </div>
        </div>
        <form
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          onSubmit={submit}
        >
          <label>
            Từ (UTC+7)
            <input
              className={input}
              type="datetime-local"
              name="from"
              value={range.from}
              onChange={(event) => { setRange({ ...range, from: event.target.value }); setPreset(null) }}
              required
            />
          </label>
          <label>
            Đến, không gồm mốc cuối (UTC+7)
            <input className={input} type="datetime-local" name="to" value={range.to} onChange={(event) => { setRange({ ...range, to: event.target.value }); setPreset(null) }} required />
          </label>
          <label>
            Nhóm theo
            <select className={input} name="groupBy" defaultValue="day">
              <option value="hour">Giờ</option>
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
            </select>
          </label>
          <label>
            Kênh
            <select className={input} name="channel">
              <option value="all">Tất cả</option>
              <option value="DineIn">Tại bàn</option>
              <option value="Takeaway">Mang đi</option>
              <option value="Mixed">Kết hợp</option>
              <option value="Unclassified">Chưa phân loại</option>
            </select>
          </label>
          <label>
            Thanh toán
            <select className={input} name="methodCode">
              <option value="all">Tất cả</option>
              <option value="Cash">Tiền mặt</option>
              <option value="BankTransfer">Chuyển khoản</option>
            </select>
          </label>
          <label>
            Ca (tùy chọn)
            <select className={input} name="shift">
              <option value="all">Tất cả ca</option>
              <option value="unassigned">Chưa gắn ca</option>
              {sales.data?.shifts
                .filter((s) => /^[a-f0-9-]{36}$/i.test(s.key))
                .map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.key}
                  </option>
                ))}
            </select>
          </label>
          <button className="btn-primary" disabled={!restaurantId}>
            Xem báo cáo
          </button>
        </form>
        {!restaurantId && <p role="status">Tài khoản cần được gán nhà hàng.</p>}
        {formError && (
          <p role="alert" className="text-rose-700">
            {formError}
          </p>
        )}
      </Panel>
      {params && [period, sales, dishes].some((query) => query.isFetching) && (
        <p role="status">Đang tải báo cáo…</p>
      )}
      {[period, sales, dishes].map(
        (query, i) =>
          query.isError && (
            <p key={i} role="alert" className="mb-3 text-rose-700">
              {errorText(query.error)}{' '}
              <button
                className="underline"
                onClick={() => void query.refetch()}
              >
                Tải lại
              </button>
            </p>
          ),
      )}
      {period.data && (
        <p className="mb-4 text-sm text-slate-600">
          Kỳ báo cáo theo múi giờ {period.data.timeZone} ·{' '}
          {period.data.fromLocal} đến {period.data.toLocal}
        </p>
      )}
      {!!warnings.length && (
        <ul className="mb-4 list-disc space-y-1 rounded-xl bg-amber-50 py-3 pr-3 pl-8 text-sm text-amber-900">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      {sales.data && (
        <>
          <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {(['collections', 'netCollections', 'netDishRevenue'] as const).map(
              (metric, index) => (
                <article key={metric} className="rounded-3xl border border-slate-200/70 bg-white p-5 text-brand-dark">
                  <div className={`mb-5 inline-flex rounded-2xl p-3 ${index === 0 ? 'bg-emerald-50 text-emerald-700' : index === 1 ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}><Icon name={index === 2 ? 'receipt' : 'chart'} size={21} /></div>
                  <p className="text-sm text-slate-500">{metrics[metric]}</p>
                  <strong className="mt-2 block text-2xl font-bold tracking-tight">{amount(sales.data.totals[metric])}</strong>
                  <p className="mt-2 text-xs text-slate-500">Trong kỳ đang chọn</p>
                </article>
              ),
            )}
            <article className="rounded-3xl border border-slate-200/70 bg-white p-5 text-brand-dark">
              <div className="mb-5 inline-flex rounded-2xl bg-amber-50 p-3 text-amber-700"><Icon name="receipt" size={21} /></div>
              <p className="text-sm text-slate-500">Đơn đã thanh toán</p>
              <strong className="mt-2 block text-2xl font-bold">
                {sales.data.totals.paidOrders.count ??
                  `Chưa đủ (${sales.data.totals.paidOrders.knownCount} đã ghi nhận)`}
              </strong>
              <p className="mt-2 text-xs text-slate-500">Giao dịch được ghi nhận trong kỳ</p>
            </article>
          </div>
          <SalesCharts data={sales.data} />
          {dishes.data && <DishChart data={dishes.data} />}
          <details className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold text-slate-700">Xem số liệu và bảng chi tiết</summary>
            <div className="my-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(Object.keys(metrics) as (keyof typeof metrics)[]).map((metric) => (
                <div key={metric} className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{metrics[metric]}</p><strong className="mt-2 block text-sm text-slate-800">{amount(sales.data.totals[metric])}</strong></div>
              ))}
            </div>
          {(
            [
              ['Theo thời gian', sales.data.groups],
              ['Theo kênh', sales.data.channels],
              ['Theo thanh toán', sales.data.methods],
              ['Theo ca', sales.data.shifts],
            ] as const
          ).map(([label, groups]) => (
            <Panel key={label} className="mb-5 overflow-x-auto">
              <h2 className="p-4 font-semibold">{label}</h2>
              {groups.length ? (
                <table className={table}>
                  <thead>
                    <tr>
                      <th>Nhóm</th>
                      <th>Đã thu</th>
                      <th>Đã hoàn</th>
                      <th>Thực thu ròng</th>
                      <th>Doanh thu món ròng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => (
                      <tr key={group.key}>
                        <td>{group.key}</td>
                        <td>{amount(group.totals.collections)}</td>
                        <td>{amount(group.totals.refunds)}</td>
                        <td>{amount(group.totals.netCollections)}</td>
                        <td>{amount(group.totals.netDishRevenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-4">Chưa có dữ liệu trong kỳ.</p>
              )}
            </Panel>
          ))}
          </details>
        </>
      )}
      {dishes.data && !sales.data && <DishChart data={dishes.data} />}
      {dishes.data && (
        <Panel className="overflow-x-auto">
          <h2 className="p-4 font-semibold">Hiệu quả theo món</h2>
          {dishes.data.items.length ? (
            <table className={table}>
              <thead>
                <tr>
                  <th>Món</th>
                  <th>Đã bán</th>
                  <th>Doanh thu</th>
                  <th>Giảm giá</th>
                  <th>Doanh thu ròng</th>
                  <th>Giá vốn</th>
                  <th>Lợi nhuận gộp</th>
                  <th>Tỷ suất đóng góp</th>
                </tr>
              </thead>
              <tbody>
                {dishes.data.items.map((item) => (
                  <tr key={item.itemId}>
                    <td>{item.names.join(' / ') || 'Món chưa có tên'}</td>
                    <td>
                      {item.quantity.quantity ??
                        `Chưa đủ (${item.quantity.knownQuantity})`}
                    </td>
                    <td>{amount(item.grossSales)}</td>
                    <td>{amount(item.discounts)}</td>
                    <td>{amount(item.netSales)}</td>
                    <td>{amount(item.cost)}</td>
                    <td>{amount(item.grossProfit)}</td>
                    <td>
                      {item.contributionMarginPercent == null
                        ? 'Chưa đủ'
                        : item.contributionMarginPercent + '%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4">Chưa có món bán trong kỳ.</p>
          )}
        </Panel>
      )}
    </>
  )
}
