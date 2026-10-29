import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
import { Icon } from '../../../../components/Icon/Icon'
import {
  PageHeading,
  Panel,
  SummaryCards,
} from '../../../admin/components/AdminUI'
import { QueryState } from '../components/QueryState'
import { useManagerOverview } from '../hooks/useManagerOverview'

export function ManagerOverview() {
  const name = useAppSelector(
    (s) => s.auth.session?.user.fullName || s.auth.session?.user.userName,
  )
  const stats = useManagerOverview()
  return (
    <>
      <div className="mb-6 rounded-2xl bg-linear-to-r from-[#003b2e] to-emerald-800 p-6 text-white sm:p-8">
        <p className="text-sm text-emerald-100">Không gian quản lý</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          Xin chào, {name || 'Quản lý'}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100">
          Quản lý thực đơn, cập nhật giá và theo dõi tình trạng bán món tại một
          nơi.
        </p>
        <Link
          to="/manager/menu/items"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-900"
        >
          Quản lý món ăn
          <Icon name="arrow" size={16} />
        </Link>
      </div>
      <QueryState
        pending={stats.isPending}
        error={stats.error}
        retry={() => void stats.refetch()}
      >
        <SummaryCards
          items={[
            {
              label: 'Danh mục',
              value: stats.data?.categories ?? '—',
              icon: 'grid',
              note: 'Danh mục thực đơn',
            },
            {
              label: 'Món ăn',
              value: stats.data?.items ?? '—',
              icon: 'utensils',
              note: 'Tất cả trạng thái',
            },
            {
              label: 'Đang bán',
              value: stats.data?.selling ?? '—',
              icon: 'check',
              note: 'Món đang mở bán',
            },
            {
              label: 'Cấu hình giá',
              value: stats.data?.prices ?? '—',
              icon: 'coin',
              note: 'Bao gồm giá đã lên lịch',
            },
          ]}
        />
      </QueryState>
      <PageHeading
        eyebrow="Quản lý"
        title="Thực đơn và giá bán"
        description="Sắp xếp danh mục, cập nhật món ăn và lên lịch giá phù hợp."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            path: 'categories',
            label: 'Danh mục',
            icon: 'grid',
            description:
              'Sắp xếp thực đơn theo danh mục, quản lý tên và trạng thái hoạt động.',
          },
          {
            path: 'items',
            label: 'Món ăn',
            icon: 'utensils',
            description:
              'Quản lý ảnh, mô tả và danh mục. Cập nhật món đang bán, hết hàng hoặc ngừng bán.',
          },
          {
            path: 'prices',
            label: 'Giá bán',
            icon: 'coin',
            description:
              'Thiết lập giá tiêu chuẩn, giá theo kênh hoặc khung giờ. Kiểm tra giá áp dụng trước khi bán.',
          },
        ].map((card) => (
          <Panel key={card.path} className="p-6">
            <span className="inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <Icon name={card.icon} size={24} />
            </span>
            <h2 className="mt-4 text-lg font-semibold">{card.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {card.description}
            </p>
            <Link
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-700"
              to={`/manager/menu/${card.path}`}
            >
              Quản lý
              <Icon name="arrow" size={16} />
            </Link>
          </Panel>
        ))}
      </div>
      <div className="mt-8">
        <PageHeading
          eyebrow="Quản lý"
          title="Nguyên liệu và giá vốn"
          description="Quản lý nguyên liệu, đơn vị, xây dựng công thức và kiểm tra khả năng tính giá vốn."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              path: 'ingredients',
              title: 'Nguyên liệu',
              description:
                'Quản lý nguyên liệu, đơn vị cơ sở và ngưỡng cảnh báo tồn kho.',
            },
            {
              path: 'recipes',
              title: 'Công thức và định mức',
              description:
                'Thiết lập định mức mỗi phần và lưu phiên bản hướng dẫn chế biến.',
            },
            {
              path: 'food-cost',
              title: 'Giá vốn món ăn',
              description:
                'Xem công thức đang hiệu lực và xác định thông tin chi phí nguyên liệu còn thiếu.',
            },
          ].map((card) => (
            <Panel key={card.path} className="p-6">
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {card.description}
              </p>
              <Link
                to={`/manager/${card.path}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-700"
              >
                Quản lý
                <Icon name="arrow" size={16} />
              </Link>
            </Panel>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <PageHeading
          eyebrow="Quản lý"
          title="Theo dõi kho"
          description="Theo dõi tồn kho, xem lô nhập và kiểm tra lượng xuất nguyên liệu ghi nhận."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              path: 'stock',
              title: 'Tổng quan tồn kho',
              description:
                'Theo dõi số dư ghi nhận và cảnh báo tồn kho thấp của nguyên liệu.',
            },
            {
              path: 'stock-history',
              title: 'Biến động và lô hàng',
              description: 'Xem biến động kho, số lượng nhập và hạn sử dụng.',
            },
            {
              path: 'stock-variance',
              title: 'Tiêu hao và chênh lệch',
              description:
                'Xem lượng xuất ghi nhận và xác định dữ liệu còn thiếu để đối chiếu tiêu hao.',
            },
          ].map((card) => (
            <Panel key={card.path} className="p-6">
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {card.description}
              </p>
              <Link
                to={`/manager/${card.path}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-700"
              >
                Xem
                <Icon name="arrow" size={16} />
              </Link>
            </Panel>
          ))}
        </div>
      </div>
    </>
  )
}
