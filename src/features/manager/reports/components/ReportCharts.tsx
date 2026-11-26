import { useId, type ReactNode } from 'react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import type { ReportResponses } from '../api/reportApi'

const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
const short = (value: number) => new Intl.NumberFormat('vi-VN', {
  notation: 'compact', maximumFractionDigits: 1,
}).format(value)
const labels: Record<string, string> = {
  DineIn: 'Tại bàn', Takeaway: 'Mang đi', Mixed: 'Kết hợp',
  Unclassified: 'Chưa phân loại', Cash: 'Tiền mặt', BankTransfer: 'Chuyển khoản',
  unassigned: 'Chưa gắn ca',
}
const tick = { fill: '#64748b', fontSize: 11 }
const tooltip = { background: '#ffffff', color: '#183b32', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }

function ChartCard({ title, hint, empty, children }: {
  title: string; hint: string; empty: boolean; children: ReactNode
}) {
  return (
    <section className="min-w-0 rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="font-semibold text-slate-800">{title}</h2>
      <p className="mt-1 mb-5 text-xs leading-5 text-slate-500">{hint}</p>
      {empty ? (
        <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">Chưa có dữ liệu trong kỳ.</div>
      ) : children}
    </section>
  )
}

export function SalesCharts({ data }: { data: ReportResponses['sales'] }) {
  const gradient = useId().replace(/:/g, '')
  const timeline = data.groups.map((group) => ({
    period: group.key,
    collections: group.totals.collections.amount ?? group.totals.collections.knownAmount,
    refunds: group.totals.refunds.amount,
    net: group.totals.netCollections.amount ?? group.totals.netCollections.knownAmount,
  }))
  const incomplete = [...data.groups, ...data.channels, ...data.methods].some((group) =>
    group.totals.collections.amount == null || group.totals.netCollections.amount == null || group.totals.refunds.amount == null,
  )
  return (
    <div className="mb-5 space-y-4">
      {incomplete && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Báo cáo chưa đầy đủ. Biểu đồ thu và thực thu ròng chỉ thể hiện phần tiền đã ghi nhận, chưa phải tổng đối soát cuối cùng. Khoản hoàn chưa xác định được để trống. Xem cảnh báo và bảng chi tiết.</p>}
      <ChartCard title="Dòng tiền theo thời gian" hint="So sánh đã thu, đã hoàn và thực thu ròng trong kỳ · Đơn vị: VND" empty={!timeline.some((row) => row.collections != null || row.refunds != null || row.net != null)}>
        <div className="h-80 w-full min-w-0" role="img" aria-label="Biểu đồ dòng tiền theo thời gian. Số liệu chi tiết trong bảng Theo thời gian.">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
              <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16836b" stopOpacity={0.3} /><stop offset="100%" stopColor="#16836b" stopOpacity={0.02} /></linearGradient></defs>
              <CartesianGrid stroke="#e8eef0" vertical={false} />
              <XAxis dataKey="period" tick={tick} tickLine={false} axisLine={false} minTickGap={36} tickFormatter={(value: string) => value.replace('T', ' ').replace(/([+-]\d{2}:\d{2}|Z)$/, '')} />
              <YAxis tick={tick} tickLine={false} axisLine={false} tickFormatter={short} width={64} />
              <Tooltip contentStyle={tooltip} labelStyle={{ color: '#183b32' }} formatter={(value) => value == null ? 'Chưa đủ dữ liệu' : currency.format(Number(value))} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 14 }} />
              <Area type="monotone" dataKey="collections" name="Đã thu (ghi nhận)" stroke="#16836b" fill={`url(#${gradient})`} strokeWidth={2} connectNulls={false} />
              <Area type="monotone" dataKey="net" name="Thực thu ròng (ghi nhận)" stroke="#5476d8" fill="#5476d8" fillOpacity={0.12} strokeWidth={2} connectNulls={false} />
              <Area type="monotone" dataKey="refunds" name="Đã hoàn" stroke="#a577d2" fill="#a577d2" fillOpacity={0.12} strokeWidth={2} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
      <div className="grid gap-4 xl:grid-cols-2">
        {([
          ['Dòng tiền theo kênh bán', data.channels],
          ['Dòng tiền theo thanh toán', data.methods],
        ] as const).map(([title, groups]) => {
          const rows = groups.map((group) => ({
            name: labels[group.key] || group.key,
            collections: group.totals.collections.amount ?? group.totals.collections.knownAmount,
            net: group.totals.netCollections.amount ?? group.totals.netCollections.knownAmount,
          }))
          return (
            <ChartCard key={title} title={title} hint="Đã thu và thực thu ròng · Đơn vị: VND" empty={!rows.some((row) => row.collections != null || row.net != null)}>
              <div className="h-64 w-full min-w-0" role="img" aria-label={title}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid stroke="#e8eef0" vertical={false} />
                    <XAxis dataKey="name" tick={tick} tickLine={false} axisLine={false} interval={0} />
                    <YAxis tick={tick} tickLine={false} axisLine={false} tickFormatter={short} width={64} />
                    <Tooltip contentStyle={tooltip} cursor={{ fill: '#f1f5f9' }} formatter={(value) => value == null ? 'Chưa đủ dữ liệu' : currency.format(Number(value))} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                    <Bar dataKey="collections" name="Đã thu (ghi nhận)" fill="#16836b" radius={[5, 5, 0, 0]} maxBarSize={44} />
                    <Bar dataKey="net" name="Thực thu ròng (ghi nhận)" fill="#5476d8" radius={[5, 5, 0, 0]} maxBarSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          )
        })}
      </div>
    </div>
  )
}

export function DishChart({ data }: { data: ReportResponses['dishes'] }) {
  const rows = data.items.filter((item) => item.netSales.amount != null || item.netSales.knownAmount !== 0)
    .sort((a, b) => (b.netSales.amount ?? b.netSales.knownAmount) - (a.netSales.amount ?? a.netSales.knownAmount))
    .slice(0, 8)
    .map((item) => ({ name: item.names.join(' / ') || 'Món chưa có tên', revenue: item.netSales.amount ?? item.netSales.knownAmount }))
  return (
    <div className="mb-5">
      <ChartCard title="Món có doanh thu cao nhất" hint="Tối đa 8 món theo doanh thu ròng đã ghi nhận · Số liệu chưa đầy đủ có thể thay đổi" empty={!rows.length}>
        <div style={{ height: Math.max(260, rows.length * 48) }} className="w-full min-w-0" role="img" aria-label="Xếp hạng doanh thu ròng theo món. Số liệu chi tiết trong bảng Hiệu quả theo món.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e8eef0" horizontal={false} />
              <XAxis type="number" tick={tick} tickLine={false} axisLine={false} tickFormatter={short} />
              <YAxis type="category" dataKey="name" tick={tick} tickLine={false} axisLine={false} width={120} tickFormatter={(value: string) => value.length > 21 ? `${value.slice(0, 20)}…` : value} />
              <Tooltip contentStyle={tooltip} cursor={{ fill: '#f1f5f9' }} formatter={(value) => currency.format(Number(value))} />
              <Bar dataKey="revenue" name="Doanh thu ròng (ghi nhận)" fill="#16836b" radius={[0, 5, 5, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  )
}
