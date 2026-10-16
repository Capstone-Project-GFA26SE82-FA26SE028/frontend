# API giỏ hàng — khung triển khai sau

Thư mục này giữ vị trí cho `cartApi.ts` khi backend có API quản lý giỏ hàng.
Hiện chưa gọi API; giỏ hàng đang được lưu trên trình duyệt bằng Redux.

Khi tích hợp:

- Chốt endpoint, request/response và quyền truy cập phiên bàn với backend.
- Dùng `axiosClient` chung tại `src/api/axiosClient.ts`.
- Triển khai lấy giỏ hàng, thêm món, cập nhật số lượng và xóa món theo API thực tế.
- Bổ sung kiểu dữ liệu và chuyển đổi response sang model giao diện nếu cần.
- Giá thanh toán và tính khả dụng của món phải được backend xác nhận.

Nếu backend chỉ có API tạo đơn, vẫn giữ giỏ hàng bằng Redux và đặt API gửi đơn
trong feature `checkout`; không cần tạo API giỏ hàng riêng.
