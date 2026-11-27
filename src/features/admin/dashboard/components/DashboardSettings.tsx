import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import type { FeeVersion } from '../../tax-fees/types/types'
import type { PayOsConfiguration } from '../../payment-methods/types/types'
import { DashboardSection } from './DashboardSection'
export function DashboardSettings({
  fees,
  payOs,
}: {
  fees?: FeeVersion
  payOs?: PayOsConfiguration
}) {
  return (
    <DashboardSection
      title="Cấu hình hiện tại"
      icon="settings"
      href="/admin/tax-fees"
      action="Chỉnh sửa"
    >
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 text-sm">
        <div className="flex justify-between p-3">
          <span>VAT</span>
          <strong className="font-semibold text-emerald-700">
            {fees ? fees.vat + '%' : 'Chưa cấu hình'}
          </strong>
        </div>
        <div className="flex justify-between p-3">
          <span>Phí dịch vụ</span>
          <strong className="font-semibold text-emerald-700">
            {fees
              ? fees.serviceEnabled
                ? fees.service + '%'
                : 'Đang tắt'
              : 'Chưa cấu hình'}
          </strong>
        </div>
        <Link
          to="/admin/payment-methods"
          className="flex items-center justify-between p-3 font-medium hover:text-emerald-700"
        >
          Phương thức thanh toán
          <Icon name="chevron" size={14} />
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <Icon name="coin" size={17} className="text-slate-500" />
          <span className="flex-1 text-slate-600">Tiền mặt</span>
          <span className="text-xs text-slate-500">Thu tại quầy</span>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <Icon name="receipt" size={17} className="text-slate-500" />
          <span className="flex-1 text-slate-600">PayOS (Chuyển khoản)</span>
          <span className="text-xs font-medium text-slate-600">
            {!payOs ? 'Chưa có thông tin' : !payOs.configured ? 'Chưa cấu hình' : payOs.enabled ? 'Đang bật' : 'Đang tắt'}
          </span>
        </div>
      </div>
    </DashboardSection>
  )
}
