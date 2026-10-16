# Thanh toán

- `pages/PaymentPage.tsx`: ghép bố cục, lấy đơn mẫu và ghi nhận yêu cầu thanh toán.
- `components/PaymentSummary.tsx`: thông tin bàn và tổng tiền tạm tính.
- `components/PaymentMethodSelector.tsx`: lựa chọn tiền mặt hoặc chuyển khoản.
- `components/PaymentPendingStatus.tsx`: thông báo chờ xác nhận.
- `types.ts`: kiểu phương thức thanh toán của giao diện.
- `api/README.md`, `hooks/README.md`: hướng dẫn tích hợp backend sau.

Hiện dùng dữ liệu Redux và yêu cầu minh họa. Chưa kết nối PayOS, chưa tạo giao
 dịch thực tế, không tự xác nhận đã thanh toán.