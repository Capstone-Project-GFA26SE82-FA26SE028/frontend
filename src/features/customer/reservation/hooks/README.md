# Hook đặt bàn — khung triển khai sau

Giữ vị trí cho `useReservation.ts`. Hiện ReservationForm tự kiểm tra thời
gian, ReservationPage quản lý việc chuyển giữa form và thông báo minh họa.

Khi có backend, hook dùng mutation của TanStack Query để gọi reservationApi:

- Quản lý gửi yêu cầu, trạng thái đang gửi và thông báo lỗi.
- Vô hiệu hóa nút trong khi gửi; phối hợp cơ chế chống trùng của backend.
- Giữ dữ liệu form nếu có lỗi để khách chỉnh sửa hoặc thử lại.
- Chỉ chuyển sang thông báo kết quả sau khi backend xác nhận đã tiếp nhận.
- Phân biệt yêu cầu đang chờ duyệt với bàn đã được nhân viên xác nhận.
- Nếu request hết thời gian chờ, xử lý kết quả chưa rõ theo contract thay vì
  tự kết luận thất bại và tạo yêu cầu mới có thể bị trùng.

Đây chỉ là tài liệu, chưa tạo hook hoặc thay đổi luồng đặt bàn hiện tại.
