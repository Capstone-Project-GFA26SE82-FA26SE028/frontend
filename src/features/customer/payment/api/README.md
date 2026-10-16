# API thanh toán — khung triển khai sau

Giữ vị trí cho `paymentApi.ts`. Hiện chỉ ghi nhận yêu cầu minh họa trong Redux,
chưa tạo giao dịch thực tế, mã QR hoặc kết nối PayOS.

Khi có backend:

- Chốt endpoint, request/response, quyền truy cập phiên bàn và cơ chế chống tạo giao dịch trùng.
- Dùng axiosClient chung để lấy hóa đơn, phương thức khả dụng và trạng thái thanh toán.
- Backend tính tổng tiền, thuế, phí và ưu đãi; không tin số tiền do frontend gửi lên.
- Tạo yêu cầu thanh toán tiền mặt hoặc giao dịch chuyển khoản theo contract thực tế.
- Với tiền mặt thu hộ: chờ thu ngân xác nhận, không tự đổi sang đã thanh toán.
- Với chuyển khoản: hiển thị QR/link do backend cấp; backend kiểm tra webhook của cổng thanh toán.
- Không coi quay lại từ cổng thanh toán hoặc đóng màn hình QR là bằng chứng đã trả tiền.
- Khóa bí mật thanh toán chỉ lưu ở backend, không đưa vào frontend.

Thống nhất cách xử lý giao dịch đang chờ, thất bại, hết hạn và mất kết nối
trước khi triển khai thử lại. Không tự tạo giao dịch mới khi kết quả cũ chưa rõ.
