# Hook giỏ hàng — khung triển khai sau

Thư mục này giữ vị trí cho `useCart.ts`. Hiện các component dùng trực tiếp
`useAppSelector` và `useAppDispatch` để đọc, cập nhật giỏ hàng trong Redux.

Khi cần tách logic, `useCart` có thể gom:

- Danh sách món, tổng số lượng và tổng tiền tạm tính.
- Thêm món, thay đổi số lượng, xóa món và làm trống giỏ hàng.

Khi backend quản lý giỏ hàng, hook gọi module `cart/api/cartApi.ts` thông qua
TanStack Query. Bổ sung trạng thái đang tải, lỗi và chờ cập nhật; UI chỉ đóng
hộp thoại hoặc chuyển trang sau khi thao tác thành công. Tránh lưu cùng một
bản dữ liệu giỏ hàng ở cả Redux và query cache.

Đây chỉ là hướng dẫn, chưa có hook hoặc thay đổi hành vi ứng dụng.
