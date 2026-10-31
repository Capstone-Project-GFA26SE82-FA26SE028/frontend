import { Link } from 'react-router-dom'
import { Icon } from '../../../../components/Icon/Icon'
import type { FeeVersion } from '../../tax-fees/types/types'
import type { PaymentMethods } from '../../payment-methods/schema'
import { DashboardSection } from './DashboardSection'
export function DashboardSettings({
  fees,
  methods,
}: {
  fees?: FeeVersion
  methods: PaymentMethods
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
        {[
          { name: 'Tiền mặt', enabled: methods.cash, icon: 'coin' },
          {
            name: 'PayOS (Chuyển khoản)',
            enabled: methods.payos,
            icon: 'receipt',
          },
        ].map((method) => (
          <div
            key={method.name}
            className="flex items-center gap-3 px-3 py-2.5"
          >
            <Icon name={method.icon} size={17} className="text-slate-500" />
            <span className="flex-1 text-slate-600">{method.name}</span>
            <span
              className={
                'flex shrink-0 items-center gap-1.5 text-xs font-medium ' +
                (method.enabled ? 'text-emerald-700' : 'text-slate-400')
              }
            >
              <Icon name={method.enabled ? 'check' : 'minus'} size={15} />
              {method.enabled ? 'Đang bật' : 'Đang tắt'}
            </span>
          </div>
        ))}
      </div>
    </DashboardSection>
  )
}
