import { Icon } from '../../../../components/Icon/Icon'
import type { Area } from '../types/types'

export function AreaDetail({
  area,
  restaurantName,
  onEdit,
  onClose,
}: {
  area: Area
  restaurantName: string
  onEdit: () => void
  onClose: () => void
}) {
  return (
    <div className="space-y-5 p-5 sm:p-6">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
            <Icon name="grid" size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="break-words text-xl font-bold text-slate-800">
              {area.areaName}
            </h3>
            <p className="mt-1 break-words text-sm text-slate-500">
              {area.areaCode}
            </p>
          </div>
        </div>
        <span
          className={
            'mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ' +
            (area.isActive
              ? 'bg-white text-emerald-700'
              : 'bg-slate-100 text-slate-600')
          }
        >
          <span
            className={
              'size-1.5 rounded-full ' +
              (area.isActive ? 'bg-emerald-500' : 'bg-slate-400')
            }
          />
          {area.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </span>
      </div>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          ['Nhà hàng', restaurantName, 'store'],
          ['Loại phục vụ', area.serviceType, 'utensils'],
          ['Loại không gian', area.spaceType, 'home'],
        ].map(([label, value, icon], index) => (
          <div
            key={label}
            className={
              'min-w-0 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 ' +
              (index === 0 ? 'sm:col-span-2' : '')
            }
          >
            <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Icon name={icon} size={16} />
              {label}
            </dt>
            <dd className="mt-2 break-words text-sm font-semibold leading-6 text-slate-700">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40 justify-center"
          onClick={onClose}
        >
          Đóng
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-40 justify-center"
          onClick={onEdit}
        >
          <Icon name="edit" size={17} />
          Sửa khu vực
        </button>
      </div>
    </div>
  )
}
