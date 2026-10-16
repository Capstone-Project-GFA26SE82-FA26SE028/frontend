import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import { DashboardSection } from './DashboardSection'
export function StatusChart({
  title,
  icon,
  label,
  items,
}: {
  title: string
  icon: string
  label: string
  items: { name: string; value: number; color: string }[]
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  return (
    <DashboardSection title={title} icon={icon}>
      <div className="flex flex-col items-center gap-4 min-[480px]:flex-row">
        <div
          className="relative size-[176px] shrink-0"
          aria-label={label + ': ' + total}
        >
          <PieChart width={176} height={176}>
            <Pie
              data={
                total
                  ? items
                  : [{ name: 'Chưa có dữ liệu', value: 1, color: '#e2e8f0' }]
              }
              dataKey="value"
              nameKey="name"
              innerRadius={57}
              outerRadius={79}
              startAngle={90}
              endAngle={-270}
              stroke="white"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {(total ? items : [{ color: '#e2e8f0' }]).map((item, i) => (
                <Cell key={i} fill={item.color} />
              ))}
            </Pie>
            {total > 0 && <Tooltip />}
          </PieChart>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <strong className="text-2xl font-bold text-slate-800">
              {total}
            </strong>
            <span className="mt-1 text-xs text-slate-500">{label}</span>
          </div>
        </div>
        <ul className="w-full min-w-0 flex-1 space-y-5">
          {items.map((item) => (
            <li key={item.name} className="flex items-center gap-2 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: item.color }}
              />
              <span className="flex-1 text-slate-600">{item.name}</span>
              <strong className="w-7 text-right font-semibold text-slate-800">
                {item.value}
              </strong>
              <span className="w-14 text-right tabular-nums text-slate-500">
                {total
                  ? ((item.value / total) * 100).toLocaleString('vi-VN', {
                      maximumFractionDigits: 1,
                    })
                  : 0}
                %
              </span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardSection>
  )
}
