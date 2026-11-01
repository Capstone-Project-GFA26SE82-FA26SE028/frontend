import { useState } from 'react'
import { Modal } from '../../../../components/Modal/Modal'

import { EmptyState } from '../../../../components/EmptyState/EmptyState'
import { SummaryCards } from '../../../../components/SummaryCards/SummaryCards'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Field } from '../../../../components/Field/Field'
import { Panel } from '../../../../components/Panel/Panel'
import { downloadCsv } from '../../utils'
import { scenarioLabels, serviceSamples, type HealthScenario } from '../data'
import { ServiceCard } from '../components/ServiceCard'

export function HealthPage() {
  const [scenario, setScenario] = useState<HealthScenario>('normal')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState('')
  const services = serviceSamples(scenario)
  const rows = services.filter((s) => filter === 'all' || s.status === filter)
  const detail = services.find((s) => s.id === selected)
  return (
    <>
      <PageHeading
        eyebrow="Hệ thống"
        title="Giám sát dịch vụ"
        description="Bản mô phỏng trạng thái dịch vụ. Chọn kịch bản để xem tình huống vận hành; không kiểm tra máy chủ hay cổng thanh toán thật."
        action={
          <button
            disabled={!rows.length}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
            onClick={() =>
              downloadCsv(
                'giam-sat-mau',
                [
                  'Dịch vụ',
                  'Kịch bản mô phỏng',
                  'Trạng thái',
                  'Độ trễ mẫu (ms)',
                ],
                rows.map((s) => [
                  s.name,
                  scenarioLabels[scenario],
                  s.status === 'up'
                    ? 'Hoạt động'
                    : s.status === 'slow'
                      ? 'Phản hồi chậm'
                      : 'Gián đoạn',
                  s.response ?? 'Không phản hồi',
                ]),
              )
            }
          >
            Xuất dữ liệu mẫu
          </button>
        }
      />
      <Panel className="mb-5 p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kịch bản mô phỏng">
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as HealthScenario)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {Object.entries(scenarioLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Lọc trạng thái">
            <select
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Tất cả dịch vụ</option>
              <option value="up">Hoạt động</option>
              <option value="slow">Phản hồi chậm</option>
              <option value="down">Gián đoạn</option>
            </select>
          </Field>
        </div>
        <p
          role="status"
          className={`mt-4 rounded-xl p-3 text-sm ${scenario === 'normal' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}
        >
          {scenario === 'normal'
            ? 'Kịch bản mẫu: cả 6 dịch vụ đều phản hồi bình thường.'
            : scenario === 'slow'
              ? 'Kịch bản mẫu: API mất 1.850 ms để phản hồi. Các dịch vụ khác vẫn hoạt động.'
              : 'Kịch bản mẫu: cổng thanh toán không phản hồi. Không ảnh hưởng đến giao dịch đang lưu trong bản dùng thử.'}
        </p>
      </Panel>
      <SummaryCards
        items={[
          {
            label: 'Dịch vụ theo dõi',
            value: services.length,
            icon: 'monitor',
            note: 'Danh mục mô phỏng',
          },
          {
            label: 'Hoạt động',
            value: services.filter((s) => s.status === 'up').length,
            icon: 'activity',
            note: 'Theo kịch bản đã chọn',
          },
          {
            label: 'Phản hồi chậm',
            value: services.filter((s) => s.status === 'slow').length,
            icon: 'clock',
            note: 'Theo kịch bản đã chọn',
          },
          {
            label: 'Gián đoạn',
            value: services.filter((s) => s.status === 'down').length,
            icon: 'shield',
            note: 'Theo kịch bản đã chọn',
          },
        ]}
      />
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {rows.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            onDetail={() => setSelected(s.id)}
          />
        ))}
      </div>
      {!rows.length && (
        <Panel>
          <EmptyState />
        </Panel>
      )}
      {detail && (
        <Modal title={detail.name} onClose={() => setSelected('')}>
          <div className="space-y-4 p-6">
            <p className="text-sm leading-6 text-slate-600">
              {detail.description}
            </p>
            <dl className="space-y-4">
              {[
                ['Nguồn dữ liệu', 'Kịch bản mô phỏng trên trình duyệt'],
                ['Kịch bản', scenarioLabels[scenario]],
                [
                  'Độ trễ mẫu',
                  detail.response === null
                    ? 'Không phản hồi'
                    : `${detail.response} ms`,
                ],
                ['Kết nối giám sát thực tế', 'Chưa kết nối API giám sát'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-sm text-slate-500">{k}</dt>
                  <dd className="mt-1">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-500">
              Khi có backend, trang này sẽ nhận kết quả kiểm tra dịch vụ và thời
              điểm cập nhật từ hệ thống giám sát.
            </p>
          </div>
        </Modal>
      )}
    </>
  )
}
