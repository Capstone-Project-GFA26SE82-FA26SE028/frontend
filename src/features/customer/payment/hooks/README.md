# Hook thanh toán — khung triển khai sau

Giữ vị trí cho `usePayment.ts`. Hiện PaymentPage đọc đơn mẫu từ Redux,
tính tổng tạm tính, chọn phương thức và ghi nhận yêu cầu minh họa.

Khi tích hợp backend, dùng TanStack Query để:

- Lấy hóa đơn và phương thức khả dụng từ paymentApi.
- Gửi yêu cầu thanh toán, quản lý trạng thái đang gửi và lỗi.
- Chặn thao tác lặp trong khi gửi; phối hợp cơ chế chống trùng của backend.
- Nhận cập nhật trạng thái từ backend qua polling hoặc kết nối thời gian thực theo contract.
- Hiển thị chờ xử lý, thành công, thất bại hoặc hết hạn theo kết quả thực tế.
- Đồng bộ đơn/hóa đơn liên quan sau khi thanh toán được xác nhận.
- Dừng theo dõi và dọn kết nối khi rời trang hoặc kết thúc phiên bàn.

Query key cần phân biệt phiên bàn và giao dịch. Giữ dữ liệu lựa chọn khi lỗi;
chỉ thông báo đã thanh toán khi backend xác nhận. Đây chỉ là tài liệu,
chưa có hook hoặc kết nối cổng thanh toán.
