# Cấu hình hạng thành viên

Trang Manager: `/manager/loyalty`. Restaurant ID lấy từ phiên đăng nhập; request sử dụng axios client có bearer token hiện tại.

| Thao tác | API |
| --- | --- |
| Đọc hạng | `GET /restaurants/{restaurantId}/loyalty/tiers` |
| Tạo hạng | `POST /restaurants/{restaurantId}/loyalty/tiers` |
| Sửa hạng | `PUT /restaurants/{restaurantId}/loyalty/tiers/{tierId}` |
| Đọc chính sách | `GET /restaurants/{restaurantId}/loyalty/policy` |
| Lưu chính sách | `PUT /restaurants/{restaurantId}/loyalty/policy` |

Các đường dẫn trên thuộc base API `/api`. Hạng dùng `loyaltyTierCode`, `loyaltyTierName`, `requiredSpend`, `discountPercent`; chính sách dùng `spendPerPoint`, `moneyPerRedeemedPoint`.

Backend hiện xét hạng theo tổng chi tiêu, không theo điểm khả dụng. UI hỗ trợ nhập ngưỡng bằng tiền hoặc điểm quy đổi theo chính sách đã lưu: `requiredSpend = điểm quy đổi × spendPerPoint`. Đây là phép quy đổi hỗ trợ cấu hình, không phải thay đổi thuật toán xét hạng. Điểm thực nhận có làm tròn theo hóa đơn và có thể chịu nhiều phiên bản chính sách.

Không tự tạo hạng hay tự lưu giá trị mặc định khi mở trang. Các hạng có sẵn (bao gồm hạng ngoài Đồng/Bạc/Vàng) được tải từ API. Lưu chính sách tạo phiên bản mới; thay đổi tỷ lệ không tự sửa ngưỡng chi tiêu của các hạng.
