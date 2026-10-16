# API xác nhận đơn — khung triển khai sau

Thư mục này giữ vị trí cho `checkoutApi.ts` khi backend có API tạo đơn hàng.
Hiện chưa gọi API; CheckoutPage tạo đơn minh họa trong Redux.

Khi tích hợp:

- Chốt endpoint, request/response và cách xác thực phiên bàn với backend.
- Dùng `axiosClient` chung tại `src/api/axiosClient.ts`.
- Gửi mã món, số lượng, tùy chọn, ghi chú và thông tin phiên theo contract thực tế.
- Backend kiểm tra phiên bàn, món còn bán, tùy chọn hợp lệ và tính lại giá chính thức.
- Thống nhất cơ chế chống tạo đơn trùng khi bấm nhiều lần hoặc gửi lại request.
- Nhận thông tin đơn đã tạo để chuyển sang màn hình theo dõi đơn.

Chỉ xóa giỏ hàng sau khi backend xác nhận tạo đơn thành công. Nếu request hết
thời gian chờ, cần kiểm tra kết quả hoặc gửi lại theo cơ chế chống trùng đã
thống nhất, không mặc định đơn chưa được tạo.

Thanh toán thuộc feature `payment`; tạo đơn thành công không có nghĩa là đã
thanh toán. Việc chuyển đơn xuống bếp do backend điều phối.
