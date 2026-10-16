# Hook theo dõi đơn — khung triển khai sau

Giữ vị trí cho `useOrderTracking.ts`. Hiện OrderTrackingPage đọc đơn mẫu từ Redux.

Khi có backend, hook dùng TanStack Query và orderTrackingApi để quản lý:

- Danh sách và chi tiết đơn trong phiên bàn đang được phép truy cập.
- Trạng thái đang tải, lỗi, danh sách trống và thao tác thử lại.
- Cập nhật query cache khi nhận sự kiện trạng thái món/đơn từ backend.
- Mất kết nối, dữ liệu chưa cập nhật và đồng bộ lại khi kết nối phục hồi.
- Hủy đăng ký sự kiện khi rời trang hoặc phiên bàn kết thúc.

Query key phải phân biệt các phiên bàn; không để dữ liệu phiên trước hiển
thị cho khách mới. Khi chuyển sang server state, tránh giữ thêm một bản đơn
trùng lặp trong Redux. Không tự tăng tiến độ bằng bộ đếm thời gian.

Đây chỉ là tài liệu, chưa tạo hook hoặc triển khai kết nối thời gian thực.
