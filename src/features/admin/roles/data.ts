import type { Role } from '../users/types'

// Proposed responsibilities for the preview; the backend must authorize every API.
export const roleDescriptions: Record<
  Role,
  { scope: string; tasks: string[] }
> = {
  Admin: {
    scope: 'Toàn nền tảng',
    tasks: [
      'Quản lý nhà hàng và duyệt đăng ký',
      'Quản lý tài khoản, gói dịch vụ và ưu đãi',
      'Theo dõi thanh toán, báo cáo và nhật ký',
    ],
  },
  Manager: {
    scope: 'Nhà hàng được phân công',
    tasks: [
      'Quản lý thực đơn, giá và chương trình ưu đãi',
      'Quản lý nhân sự, bàn và vận hành nhà hàng',
      'Theo dõi kho, nhà cung cấp và báo cáo nhà hàng',
    ],
  },
  Waiter: {
    scope: 'Nhà hàng được phân công',
    tasks: [
      'Tiếp nhận khách và hỗ trợ gọi món',
      'Theo dõi đơn và phục vụ món',
      'Tiếp nhận yêu cầu dịch vụ tại bàn',
    ],
  },
  Cashier: {
    scope: 'Nhà hàng được phân công',
    tasks: [
      'Kiểm tra hóa đơn của bàn',
      'Xử lý thanh toán tại nhà hàng',
      'Theo dõi giao dịch trong ca',
    ],
  },
  Kitchen: {
    scope: 'Nhà hàng được phân công',
    tasks: [
      'Tiếp nhận danh sách món cần chế biến',
      'Cập nhật tiến độ chế biến',
      'Thông báo món đã hoàn thành',
    ],
  },
  Inventory: {
    scope: 'Nhà hàng được phân công',
    tasks: [
      'Theo dõi nguyên liệu và tồn kho',
      'Ghi nhận nhập, xuất và kiểm kê',
      'Theo dõi nhu cầu bổ sung nguyên liệu',
    ],
  },
  Supplier: {
    scope: 'Đơn cung ứng được phân công tại nhà hàng',
    tasks: [
      'Theo dõi yêu cầu cung ứng được chia sẻ',
      'Cập nhật tiến độ giao nguyên liệu',
      'Đối chiếu thông tin giao nhận được chia sẻ',
    ],
  },
}

// Keep these role colors aligned with the user list.
export const roleColors: Record<Role, string> = {
  Admin: 'border-blue-200 bg-blue-100 text-blue-900',
  Manager: 'border-violet-200 bg-violet-100 text-violet-900',
  Waiter: 'border-cyan-200 bg-cyan-100 text-cyan-900',
  Cashier: 'border-emerald-200 bg-emerald-100 text-emerald-900',
  Kitchen: 'border-orange-200 bg-orange-100 text-orange-900',
  Inventory: 'border-amber-200 bg-amber-100 text-amber-900',
  Supplier: 'border-slate-300 bg-slate-200 text-slate-800',
}
