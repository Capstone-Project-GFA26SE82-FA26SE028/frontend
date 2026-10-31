import { Icon } from '../../../../components/Icon/Icon'
import { secondaryButton } from '../../components/AdminUI'
import { Badge } from '../../../../components/Badge/Badge'
import { Panel } from '../../../../components/Panel/Panel'
import type { serviceSamples } from '../data'

export function ServiceCard({
  service,
  onDetail,
}: {
  service: ReturnType<typeof serviceSamples>[number]
  onDetail: () => void
}) {
  return (
    <Panel className="flex flex-col p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon name={service.icon} size={22} />
        </span>
        <Badge
          tone={
            service.status === 'up'
              ? 'green'
              : service.status === 'slow'
                ? 'amber'
                : 'red'
          }
        >
          {service.status === 'up'
            ? 'Hoạt động'
            : service.status === 'slow'
              ? 'Phản hồi chậm'
              : 'Gián đoạn'}
        </Badge>
      </div>
      <h2 className="mt-4 text-lg font-semibold">{service.name}</h2>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
        {service.description}
      </p>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-500">Độ trễ mẫu</p>
          <p className="mt-1 text-xl font-semibold">
            {service.response === null
              ? 'Không phản hồi'
              : `${service.response} ms`}
          </p>
        </div>
        <button className={secondaryButton} onClick={onDetail}>
          Chi tiết
        </button>
      </div>
    </Panel>
  )
}
