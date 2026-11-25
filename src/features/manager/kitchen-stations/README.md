# Thiết lập trạm bếp (Manager)

- `/manager/kitchen-stations`: tìm kiếm, lọc trạng thái, phân trang, tạo, sửa và bật/tắt trạm.
- `/manager/kitchen-stations/items`: lọc món theo trạm, gán hoặc bỏ gán từng món.

Module gồm `api`, `components`, `constants`, `hooks`, `pages`, `schemas`, `types`, `utils`.
API dùng Axios client hiện có: GET/POST `/kitchen-stations`, GET/PUT
`/kitchen-stations/{id}`, PATCH `/kitchen-stations/{id}/status`, GET `/items`,
PATCH `/items/{id}/kitchen-station`.

Chỉ trạm active được chọn để gán mới. Bỏ gán gửi `kitchenStationId: null`.
Mỗi lần lưu món gửi `version` từ API; khi lỗi, tải lại danh sách để lấy phiên bản mới.
Danh sách món và lựa chọn trạm được đọc qua tất cả các trang API trước khi lọc ở client.
Không có API xóa trạm; ngừng trạm giữ nguyên các tác vụ bếp hiện có.
