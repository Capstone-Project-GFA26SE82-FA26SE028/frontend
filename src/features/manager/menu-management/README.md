# Thực đơn và giá bán — Manager

Workspace `/manager` dùng cùng ngôn ngữ thiết kế với Admin: sidebar xanh,
header tài khoản, panel, bảng, bộ lọc, phân trang và modal dùng chung.
Đăng nhập với role `manager` sẽ chuyển vào workspace này; Admin không tự
được cấp quyền Manager.

## Cấu trúc thư mục

```text
menu-management/
├── api/
│   └── catalogApi.ts          # Gọi backend, đọc response, xử lý lỗi
├── components/
│   ├── FormActions.tsx       # Nút lưu/hủy dùng chung
│   ├── MenuTabs.tsx          # Điều hướng giữa các màn hình
│   ├── PriceForm.tsx         # Form tạo/sửa/thay giá
│   ├── PricePreview.tsx      # Form tra cứu giá áp dụng
│   └── QueryState.tsx        # Trạng thái tải, lỗi, danh sách trống
├── constants/
│   ├── catalog.ts           # Nhãn trạng thái món và kênh bán
│   └── styles.ts            # Style bảng dùng chung
├── hooks/
│   ├── useCatalogMutation.ts
│   ├── useCategories.ts
│   ├── useCategoryChoices.ts
│   ├── useItemChoices.ts
│   ├── useItems.ts
│   ├── useManagerOverview.ts
│   ├── usePricePreview.ts
│   └── usePrices.ts
├── pages/
│   ├── CategoriesPage.tsx
│   ├── ItemsPage.tsx
│   ├── ManagerOverview.tsx
│   └── PricesPage.tsx
├── schemas/
│   └── catalogSchema.ts     # Kiểm tra dữ liệu bằng Zod
├── types/
│   └── catalog.ts           # Kiểu dữ liệu món, nhóm món, giá và form
└── utils/
    └── price.ts             # Định dạng giờ, chuyển UTC, trạng thái giá
```

Luồng sử dụng: `pages/components → hooks → api`; các lớp dùng chung kiểu
dữ liệu trong `types`, kiểm tra cấu trúc trong `schemas`. Routes được khai báo
tại `src/routes/managerRoutes.tsx`; khung giao diện ở
`src/layouts/manager/ManagerShell.tsx`.

| Trang | Chức năng |
| --- | --- |
| `/manager` | Tổng quan số nhóm món, món ăn, món đang bán, cấu hình giá |
| `/manager/menu/categories` | Tìm kiếm, lọc, tạo, sửa, bật/tắt, xóa nhóm trống |
| `/manager/menu/items` | Tìm kiếm, lọc, tạo/sửa món, cập nhật trạng thái bán |
| `/manager/menu/prices` | Lọc giá theo món/kênh, tạo lịch giá, sửa/xóa giá tương lai, thay giá đang hiệu lực, tra cứu giá áp dụng |

Các trang gọi API Catalog thật qua `axiosClient` và interceptor đăng nhập hiện có.
Không thay dữ liệu lỗi bằng dữ liệu mẫu. Có trạng thái đang tải, danh sách trống,
lỗi và thử lại. Sau khi lưu sẽ làm mới các truy vấn Manager liên quan.
Danh sách lựa chọn lấy đủ các trang API, không giới hạn ở 100 bản ghi đầu.

Giá sử dụng giờ Việt Nam UTC+7, chuyển sang ISO UTC khi gửi API.
Các kênh hiện hỗ trợ là `AllChannels` và `DineIn`, theo cấu hình Catalog trong repo.
Nếu backend bổ sung kênh, cập nhật `channels` trong `constants/catalog.ts` cho phù hợp.
Giá đã hiệu lực được thay bằng API `replace` để giữ lịch sử. Sửa giá tương lai
không gửi `itemId`, đúng hợp đồng API từ chối trường không khai báo.

Món dùng `version` từ API để sửa thông tin hoặc trạng thái. Mở bán vẫn do backend
kiểm tra nhóm hoạt động, giá chuẩn và BOM đang hiệu lực. Workspace này chưa có màn
hình cấu hình BOM; quản lý công thức thuộc nhóm nghiệp vụ nguyên liệu/công thức.

Kiểm tra: `npm run build` và `npm run lint` trong thư mục `frontend`.
