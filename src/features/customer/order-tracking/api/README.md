# API theo dõi đơn — khung triển khai sau

Giữ vị trí cho `orderTrackingApi.ts` khi có backend. Hiện đơn và tiến độ chỉ
là dữ liệu minh họa trong Redux; chưa gọi API hoặc nhận sự kiện từ bếp.

Khi tích hợp:

- Chốt endpoint, request/response và cách xác thực quyền truy cập phiên bàn.
- Dùng axiosClient chung để lấy danh sách, chi tiết đơn thuộc phiên hợp lệ.
- Chuyển dữ liệu API sang model giao diện; cập nhật types.ts theo contract thực tế.
- Phân biệt trạng thái chế biến/phục vụ của từng món với trạng thái thanh toán.
- Không coi cả đơn hoàn thành chỉ vì một món đã xong.
- Thống nhất WebSocket/SignalR hoặc polling để nhận cập nhật; tải lại dữ liệu
  khi kết nối được khôi phục, xử lý sự kiện lặp và sai thứ tự theo contract.

Khách chỉ xem tiến độ; không được tự xác nhận món đã nấu, đã phục vụ hoặc
đã thanh toán. Các trạng thái này phải do backend xác nhận.
