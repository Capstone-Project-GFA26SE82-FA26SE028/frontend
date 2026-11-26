import { useState, type FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useAppSelector } from '../../../../app/hooks'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Panel } from '../../../../components/Panel/Panel'
import { getReport, type Totals } from '../api/reportApi'

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
  return value.amount == null
    ? `Chưa đủ (${money.format(value.knownAmount)} đã ghi nhận)`
    : money.format(value.amount)
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
  const [params, setParams] = useState<{
    from: string
    to: string
    groupBy: string
    channel: string
    methodCode: string
    shift: string
  }>()
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
      from: from + '+07:00',
      to: to + '+07:00',
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
              required
            />
          </label>
          <label>
            Đến, không gồm mốc cuối (UTC+7)
            <input className={input} type="datetime-local" name="to" required />
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
          <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(metrics) as (keyof typeof metrics)[]).map(
              (metric) => (
                <Panel key={metric} className="p-4">
                  <p>{metrics[metric]}</p>
                  <strong>{amount(sales.data.totals[metric])}</strong>
                </Panel>
              ),
            )}
            <Panel className="p-4">
              <p>Đơn đã thanh toán</p>
              <strong>
                {sales.data.totals.paidOrders.count ??
                  `Chưa đủ (${sales.data.totals.paidOrders.knownCount} đã ghi nhận)`}
              </strong>
            </Panel>
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
        </>
      )}
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
