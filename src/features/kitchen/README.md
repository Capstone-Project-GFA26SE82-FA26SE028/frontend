# Kitchen KDS

Giao diện Kitchen theo sheet `Kitchen_Staff` trong `PHAN_TICH_NGHIEP_VU.xlsx`. Dùng React Router lazy routes, Redux Toolkit và các thành phần Card/Badge/Modal/Icon, màu sidebar của giao diện Admin/Manager hiện có.

## Chạy

Trong `frontend`: `npm run dev`, đăng nhập tài khoản có role Kitchen tại `/login`, mở `/kitchen` để vào thẳng dashboard. Kitchen dùng phiên xác thực API chung (đăng nhập, khôi phục phiên, refresh token và đăng xuất); không cần đăng nhập dùng thử. Khu bếp mặc định của dữ liệu mẫu là `Bếp nóng`, chưa ánh xạ phân công khu bếp từ API.

Không cần dependency mới; không thay đổi package.json hoặc package-lock.json.

## Ánh xạ chức năng Excel

| UC | Chức năng | Màn hình / xử lý |
| --- | --- | --- |
| KIT_01 | Đăng nhập / đăng xuất | `auth/pages/KitchenLoginPage.tsx`; layout chặn các trang khi chưa vào phiên mẫu, xác nhận đăng xuất. Form đăng nhập thật thông báo chưa kết nối API. |
| KIT_02 | Tổng quan hoạt động | `dashboard/pages/DashboardPage.tsx`; số phần Pending/Cooking/Ready, trung bình Cooking → Ready theo kỳ, chỉ lấy khu bếp của phiên. |
| KIT_03 | Tiếp nhận order | `order-queue/pages/QueuePage.tsx`; công cụ mô phỏng QR, chống trùng event ID và ticket ID, giữ order ID và thứ tự nhận. |
| KIT_04 | Chi tiết món / ghi chú | `shared/components/TicketCard.tsx`; bàn, số lượng, ghi chú hiện tại/trước thay đổi, thời gian và nhật ký theo ticket. |
| KIT_05 | Hàng đợi | Tìm bàn/order/món không dấu; sắp FIFO, VIP, gom món; thứ tự phụ theo thời gian và ID, không bỏ ticket. |
| KIT_06 | Pending → Cooking → Ready | `shared/rules.ts`; kiểm tra thứ tự, phạm vi, ghi người và thời gian, cập nhật các màn hình Redux ngay. |
| KIT_07 | Hết món / tạm dừng | `unavailable-dishes/pages/AvailabilityPage.tsx`; yêu cầu lý do, khóa nhận order mô phỏng mới, không sửa order cũ. |
| KIT_08 | Thiếu nguyên liệu | `inventory/pages/IngredientsPage.tsx`; nguyên liệu, mức thiếu, ghi chú, nguồn/thời gian, nơi nhận Kho + Manager và trạng thái tiếp nhận mô phỏng. |
| KIT_09 | Công thức | `recipes/pages/RecipesPage.tsx`; phiên bản đang hiệu lực trong dữ liệu mẫu, định lượng theo số phần, ảnh thành phẩm và các bước; không có nút sửa. |
| KIT_10 | Nhận hủy | `notifications/pages/NotificationsPage.tsx`; mô phỏng sự kiện từ bên ngoài, chỉ Pending được hủy, giữ lý do trong lịch sử, không trừ kho. |
| KIT_11 | Báo Waiter khi Ready | Tạo một thông báo cho mỗi ticket chuyển Ready; thử gửi thất bại và retry trên cùng bản ghi, không tạo trùng. |
| KIT_12 | Trừ kho BOM/FIFO | Khi Cooking, kiểm tra toàn bộ BOM rồi trừ các lô theo ngày nhập. Lưu giao dịch từng lô/ticket và cảnh báo tồn ≤ ngưỡng. |
| KIT_13 | Lịch sử | `history/pages/HistoryPage.tsx`; lọc ngày, bàn/order/món, trạng thái, nhật ký khu bếp; chỉ đọc. |

## Kiến trúc

- `kds/pages/KdsPage.tsx` và `kds/styles/kds.css`: bảng ba cột tại `/kitchen/kds`, lọc VIP/chờ lâu, tìm kiếm, thứ tự thời gian/VIP, chi tiết món và chế độ tập trung. Chuyển trạng thái sử dụng cùng quy tắc trừ kho và thông báo. Ngưỡng chờ lâu 10 phút là cấu hình mẫu; thời gian trên thẻ tính từ lúc nhận, thời gian chế biến được hiển thị riêng.

- `src/layouts/kitchen`: sidebar responsive/thu gọn, header, phiên dùng thử, phản hồi thao tác và logout.
- `src/routes/kitchenRoutes.tsx`: routes `/kitchen`, `/queue`, `/cooking`, `/ready`, `/menu`, `/ingredients`, `/recipes`, `/notifications`, `/history`.
- `shared/types.ts`, `data.ts`: kiểu dữ liệu và seed; tồn kho seed là số dư hiện tại, các ticket đã Cooking/Ready từ trước không tạo lại giao dịch tồn kho.
- `shared/rules.ts`: kiểm tra và áp dụng nghiệp vụ thuần, dùng chung với unit test.
- `shared/kitchenSlice.ts`: Redux reducer; `hooks.ts`: thao tác và thời gian hiển thị. Timer chỉ cập nhật thời gian, không giả lập kết nối server.
- Tái sử dụng UI Manager, nhưng dữ liệu Kitchen độc lập; không sửa reducer hay persistence của Admin.

## Phạm vi và điều cần nối backend

Các màn hình được chuyển từ `old-frontend`; API Kitchen hiện có trong frontend được giữ lại nhưng chưa nối vào UI dùng thử. Bản này triển khai giao diện và luồng nghiệp vụ cục bộ, không phải hệ thống tích hợp hoàn chỉnh. Tải lại trang đặt lại dữ liệu; đăng xuất giữ dữ liệu vận hành trong bộ nhớ, nhưng khóa truy cập giao diện. Không lưu mật khẩu.

Cần API xác thực tài khoản Kitchen hoạt động và phân quyền phía server; order event/WebSocket + replay cursor; transaction trừ kho và khóa đồng thời; dữ liệu công thức/version/media thật; push notification và retry worker; đồng bộ availability sang POS/QR và cảnh báo sang Kho/Manager; lưu audit/history 24/24. Guard phía frontend không thay thế bảo mật server. Chưa có video công thức trong dữ liệu nguồn nên giao diện ghi rõ chưa có video.

Các giả định cần thống nhất:

- KIT_07 cho Kitchen báo tạm hết/tạm dừng và mở lại; không có quyền ngừng kinh doanh vĩnh viễn. MGR_03 trong Excel ghi chỉ Manager thay đổi trạng thái bán nên cần chốt phân quyền trước khi nối API.
- Khi không đủ BOM, chặn bắt đầu Cooking và không trừ bất kỳ lô nào; loại lô hết hạn, cảnh báo lô còn dưới 24 giờ. Đây là chính sách của bản mẫu, cần xác nhận nghiệp vụ.
- KIT_12 dẫn chiếu INV_02 cho cảnh báo nhưng INV_02 đang là thêm nguyên liệu; giao diện dùng cảnh báo cho Kho/Manager và phản hồi mô phỏng.
- Một ticket chứa một dòng món; số dashboard là số phần, thời gian trung bình là trung bình theo dòng món đã Ready/Served. Không tính món hủy.

## Kiểm tra

- `npm run build`
- `node --experimental-strip-types --test scripts/kitchen-rules.test.mjs` (Node hỗ trợ strip TypeScript).
- ESLint các file Kitchen và các điểm tích hợp store/router.

Unit test kiểm tra scope/auth, sự kiện lặp, trạng thái, FIFO qua nhiều lô và lô hết hạn, thiếu nguyên liệu không cập nhật dở dang, BOM lặp nguyên liệu, hủy Pending, availability, retry thông báo và cảnh báo kho.

Kiểm tra khi chuyển sang frontend: build production, ESLint phạm vi Kitchen và 10 test nghiệp vụ. Chưa kiểm tra trình duyệt trong lần chuyển này.