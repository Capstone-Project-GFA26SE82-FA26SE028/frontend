# Hook xác nhận đơn — khung triển khai sau

Thư mục này giữ vị trí cho `useCheckout.ts`. Hiện logic xác nhận đơn minh họa
đang nằm trong `pages/CheckoutPage.tsx`.

Khi có backend, hook dùng mutation của TanStack Query để gọi
`checkout/api/checkoutApi.ts` và quản lý:

- Gửi yêu cầu tạo đơn từ giỏ hàng và phiên bàn hiện tại.
- Trạng thái đang gửi để vô hiệu hóa nút xác nhận, tránh bấm lặp.
- Thông báo lỗi như phiên hết hiệu lực, món hết hàng hoặc thay đổi giá.
- Giữ giỏ hàng khi gửi thất bại để khách có thể chỉnh sửa và thử lại.
- Khi thành công: cập nhật dữ liệu đơn, xóa phần giỏ đã gửi và chuyển tới trang theo dõi.

Cơ chế chống trùng cần hỗ trợ từ backend; khóa nút trên giao diện không đủ.
Nếu cho phép sửa giỏ khi đang gửi, chỉ xóa những món thuộc lượt gửi đã thành
công, không xóa các món khách vừa thêm sau đó.

Đây chỉ là hướng dẫn, chưa tạo hook hoặc thay đổi hành vi ứng dụng.
