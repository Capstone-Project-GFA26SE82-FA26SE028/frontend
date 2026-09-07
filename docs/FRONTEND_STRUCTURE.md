# Cấu trúc frontend đầy đủ

Đã tạo cấu trúc theo yêu cầu người dùng trong thư mục `Frontend/` hiện tại.
`restaurant/frontend` trong sơ đồ là tên minh họa, không tạo thêm project lồng nhau.
Favicon giữ file SVG hiện có. AppProviders.tsx và các cấu hình TypeScript/ESLint
hiện có vẫn được giữ ngoài các file liệt kê trong mẫu.

## Trạng thái

- Đang chạy: Providers, Router, CustomerLayout, trang khung Menu/Cart, cartSlice,
  EmptyState, cấu hình QueryClient và Axios.
- File mới có `KHUNG SOURCE` và `TODO`: chỉ giữ vị trí, chưa export component,
  hook hoặc API có thể sử dụng. Phải triển khai trước khi import vào ứng dụng.
- Các thư mục có README giúp Git lưu lại cấu trúc và ghi rõ chưa triển khai.
- Auth, role guards, API và các module quản trị/AI chưa hoạt động.
- `.env` được tạo từ `.env.example` nếu chưa có và không được đưa lên Git.

## Cây thư mục mục tiêu đã tạo

```text
restaurant/
└── frontend/                         # Toàn bộ web React của hệ thống
    │
    ├── public/                       # File public, trình duyệt truy cập trực tiếp
    │   ├── favicon.svg
    │   └── images/
    │
    ├── src/                          # Source code chính của React
    │   │
    │   ├── app/                      # Cấu hình lõi của ứng dụng
    │   │   ├── store.ts              # Redux Store tổng
    │   │   ├── hooks.ts              # useAppDispatch, useAppSelector
    │   │   └── queryClient.ts        # Cấu hình TanStack Query
    │   │
    │   ├── api/                      # Cấu hình gọi Backend dùng chung
    │   │   ├── axiosClient.ts        # Axios instance: baseURL, token, interceptor
    │   │   └── endpoints.ts          # Khai báo URL API nếu muốn gom chung
    │   │
    │   ├── assets/                   # Tài nguyên được import trong code
    │   │   ├── images/               # Hình món ăn, banner,...
    │   │   ├── icons/                # Icon riêng của project
    │   │   └── logos/                # Logo nhà hàng
    │   │
    │   ├── components/               # Component dùng chung nhiều feature
    │   │   ├── Button/
    │   │   ├── Modal/
    │   │   ├── Loading/
    │   │   ├── EmptyState/
    │   │   ├── ConfirmDialog/
    │   │   └── DataTable/
    │   │
    │   ├── layouts/                  # Khung giao diện cho từng nhóm người dùng
    │   │   ├── CustomerLayout.tsx    # Layout khách hàng
    │   │   ├── AdminLayout.tsx       # Layout admin
    │   │   ├── ManagerLayout.tsx     # Layout manager
    │   │   ├── InventoryLayout.tsx   # Layout nhân viên kho
    │   │   └── KitchenLayout.tsx     # Layout màn hình bếp/KDS
    │   │
    │   ├── routes/                   # Quản lý đường dẫn của web
    │   │   ├── router.tsx            # Khai báo toàn bộ route
    │   │   ├── ProtectedRoute.tsx    # Kiểm tra đã đăng nhập chưa
    │   │   └── RoleRoute.tsx         # Kiểm tra đúng role mới cho vào
    │   │
    │   ├── features/                 # QUAN TRỌNG: toàn bộ nghiệp vụ chính
    │   │
    │   │   ├── auth/                 # Đăng nhập, đăng xuất, tài khoản
    │   │   │   ├── pages/
    │   │   │   │   └── LoginPage.tsx
    │   │   │   ├── components/
    │   │   │   │   └── LoginForm.tsx
    │   │   │   ├── api/
    │   │   │   │   └── authApi.ts
    │   │   │   ├── hooks/
    │   │   │   │   └── useLogin.ts
    │   │   │   ├── authSlice.ts      # Redux lưu user, token, role
    │   │   │   └── types.ts
    │   │   │
    │   │   ├── customer/             # Toàn bộ chức năng dành cho khách
    │   │   │   │
    │   │   │   ├── menu/             # Xem menu
    │   │   │   │   ├── pages/
    │   │   │   │   │   ├── MenuPage.tsx
    │   │   │   │   │   └── DishDetailPage.tsx
    │   │   │   │   ├── components/
    │   │   │   │   │   ├── DishCard.tsx
    │   │   │   │   │   ├── CategoryTabs.tsx
    │   │   │   │   │   └── DishOptionModal.tsx
    │   │   │   │   ├── api/
    │   │   │   │   │   └── menuApi.ts
    │   │   │   │   ├── hooks/
    │   │   │   │   │   └── useMenu.ts
    │   │   │   │   └── types.ts
    │   │   │   │
    │   │   │   ├── cart/             # Giỏ hàng của khách
    │   │   │   │   ├── pages/
    │   │   │   │   │   └── CartPage.tsx
    │   │   │   │   ├── components/
    │   │   │   │   │   ├── CartItem.tsx
    │   │   │   │   │   └── CartSummary.tsx
    │   │   │   │   ├── cartSlice.ts  # Redux lưu giỏ hàng
    │   │   │   │   └── types.ts
    │   │   │   │
    │   │   │   ├── checkout/         # Xác nhận đơn hàng
    │   │   │   ├── payment/          # Thanh toán
    │   │   │   └── order-tracking/   # Theo dõi trạng thái đơn
    │   │   │
    │   │   ├── admin/                # Chức năng dành cho System Admin
    │   │   │   ├── dashboard/
    │   │   │   ├── users/
    │   │   │   ├── branches/
    │   │   │   ├── tables/
    │   │   │   ├── roles/
    │   │   │   ├── permissions/
    │   │   │   └── settings/
    │   │   │
    │   │   ├── manager/              # Chức năng Restaurant Manager
    │   │   │   ├── dashboard/
    │   │   │   ├── menu-management/
    │   │   │   ├── categories/
    │   │   │   ├── dishes/
    │   │   │   ├── recipes/
    │   │   │   ├── promotions/
    │   │   │   ├── suppliers/
    │   │   │   ├── purchase-requests/
    │   │   │   ├── reports/
    │   │   │   └── analytics/
    │   │   │
    │   │   ├── inventory/            # Nhân viên kho
    │   │   │   ├── ingredients/      # Nguyên liệu
    │   │   │   ├── stock/            # Tồn kho
    │   │   │   ├── stock-in/         # Nhập kho
    │   │   │   ├── stock-out/        # Xuất kho
    │   │   │   ├── expiration/       # Hạn sử dụng
    │   │   │   ├── purchase-orders/  # Đơn nhập hàng
    │   │   │   └── reports/
    │   │   │
    │   │   ├── kitchen/              # Kitchen Display System
    │   │   │   ├── order-queue/      # Danh sách món cần làm
    │   │   │   ├── cooking/          # Món đang nấu
    │   │   │   ├── ready-orders/     # Món đã hoàn thành
    │   │   │   ├── unavailable-dishes/
    │   │   │   └── notifications/
    │   │   │
    │   │   └── ai/                   # Các chức năng AI
    │   │       ├── assistant/         # Chat/AI Assistant
    │   │       ├── demand-forecast/   # Dự báo nhu cầu
    │   │       ├── inventory-prediction/
    │   │       ├── purchase-recommendation/
    │   │       └── analytics/
    │   │
    │   ├── hooks/                    # Hook dùng chung toàn app
    │   │   ├── useDebounce.ts
    │   │   └── usePagination.ts
    │   │
    │   ├── types/                    # TypeScript type/interface dùng chung
    │   │   ├── api.ts
    │   │   ├── user.ts
    │   │   └── common.ts
    │   │
    │   ├── constants/                # Các giá trị cố định
    │   │   ├── roles.ts
    │   │   ├── routes.ts
    │   │   └── orderStatus.ts
    │   │
    │   ├── utils/                    # Hàm tiện ích
    │   │   ├── currency.ts           # Format tiền
    │   │   ├── date.ts               # Format ngày giờ
    │   │   └── storage.ts            # localStorage/sessionStorage
    │   │
    │   ├── styles/
    │   │   └── global.css            # CSS dùng chung
    │   │
    │   ├── App.tsx                   # Component gốc
    │   └── main.tsx                  # Điểm bắt đầu chạy React
    │
    ├── .env                          # Biến môi trường thực tế
    ├── .env.example                  # Mẫu env để push Git
    ├── package.json                  # Thư viện project
    ├── tsconfig.json                 # Cấu hình TypeScript
    └── vite.config.ts                # Cấu hình Vite
```

## Quy tắc triển khai

- Page nằm trong feature/pages; component riêng nằm trong feature/components.
- Component dùng chung nằm trong src/components/TenComponent/.
- EmptyState đang dùng: src/components/EmptyState/EmptyState.tsx.
- Redux lưu client state dùng chung; TanStack Query quản lý server state.
- Hook query gọi API module của feature; API module sử dụng axiosClient chung.
- Không tự chốt API contract, token strategy hoặc trạng thái đơn từ file khung.
- menu-management có thể là trang tổng hợp, categories/dishes giữ nghiệp vụ riêng;
  tránh sao chép cùng một logic vào ba thư mục.
- Bộ khung này được tạo đầy đủ theo yêu cầu mới; không có nghĩa chức năng hoàn tất.

## Chạy và kiểm tra

```powershell
npm run dev
npm run build
npm run lint
```

Mở /menu và /cart. Route khác vẫn hiển thị trang không tìm thấy.
Khi deploy SPA, cấu hình hosting trả index.html cho route frontend; không rewrite API.