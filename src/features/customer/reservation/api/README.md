# API đặt bàn — khung triển khai sau

Giữ vị trí cho `reservationApi.ts` khi có backend. Hiện form chỉ kiểm tra dữ
liệu và hiển thị thông báo minh họa; chưa lưu hay gửi yêu cầu tới nhà hàng.

Khi tích hợp:

- Chốt endpoint, request/response và cơ chế xác thực/chống gửi trùng với backend.
- Dùng axiosClient chung để gửi tên khách, điện thoại, ngày giờ, số khách và ghi chú.
- Thống nhất múi giờ nhà hàng và định dạng thời gian, không mặc định múi giờ trình duyệt.
- Backend kiểm tra dữ liệu, thời gian đặt trước từ 30 phút đến 30 ngày và khả năng phục vụ.
- Nhận mã yêu cầu và trạng thái thực tế từ backend; tạo yêu cầu không đồng nghĩa đã xác nhận bàn.
- Chỉ bổ sung API tra cứu, sửa hoặc hủy khi backend có contract và quyền truy cập tương ứng.

Nhân viên duyệt yêu cầu; quy tắc giữ bàn tối đa 15 phút sau giờ hẹn phải do
backend quản lý. Các kiểu dữ liệu hiện tại chưa chốt contract API.
