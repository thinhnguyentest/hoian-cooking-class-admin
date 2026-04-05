# KẾ HOẠCH TÍCH HỢP ADMIN CMS VÀ BACKEND

Kế hoạch này chi tiết các bước để chuyển đổi từ dữ liệu Mock hiện tại sang hệ thống API thực tế, đảm bảo các thao tác Chỉnh sửa và Xuất bản (Publish) hoạt động ổn định.

---

## Giai đoạn 1: Chuẩn bị Backend (BE)

Mục tiêu: Đảm bảo BE sẵn sàng nhận và xử lý các yêu cầu phức tạp (Nested JSON) từ Admin.

### 1.1. Hoàn thiện Logic "Sync" (Dữ liệu lồng nhau)
Trong `PageServiceImpl.java`, cần hoàn thiện phương thức `updatePage` để xử lý đồng thời danh sách `PageContent` và `Menu` trong cùng một Request:
- **Input**: `PageRequest` (bao gồm `List<PageContentRequest>` và `List<MenuRequest>`).
- **Logic**: 
  - Cập nhật thông tin cơ bản của Page.
  - So sánh danh sách Content mới/cũ: Xóa bản ghi cũ không còn tồn tại, Cập nhật bản ghi trùng ID, Thêm bản ghi mới.
  - Thực hiện tương tự cho danh sách Menus.

### 1.2. Cấu hình CORS (Cross-Origin Resource Sharing)
Cho phép Admin Frontend (Port 5173) truy cập API của BE (Port 8080).
- Thêm `@CrossOrigin(origins = "http://localhost:5173")` vào `PageController`.
- Hoặc cấu hình global trong `WebMvcConfigurer`.

---

## Giai đoạn 2: Cấu hình Environment & Frontend

### 2.1. Thiết lập Biến môi trường
Tạo tệp `.env` tại thư mục gốc của dự án Admin:
```env
VITE_API_URL=http://localhost:8080/api/v1
```

### 2.2. Kích hoạt API Service
Tại `src/features/content/services/page-service.ts`:
- Đổi flag `const IS_MOCK = false`.
- Kiểm tra lại hàm `apiFetch` trong `utils/api-client.ts` để đảm bảo nó đọc đúng `import.meta.env.VITE_API_URL`.

---

## Giai đoạn 3: Tích hợp & Kiểm thử Chức năng

### 3.1. Đồng bộ Page Listing
- Kiểm tra trang **CMS Content** có hiển thị đúng 4 trang lấy từ Database không.
- Kiểm tra tính năng Tìm kiếm (Search) có gọi API `GET /pages?title=...` hay không.

### 3.2. Chỉnh sửa & Lưu (The "Publish" Action)
- Mở Drawer chỉnh sửa cho trang **Cooking Class**.
- Thay đổi nội dung trong tab **PAGE CONTENT**.
- Nhấn **PUBLISH LIVE** và theo dõi Network tab trong DevTools:
  - Expect: Request `PUT /api/v1/pages/{id}` với Payload JSON đầy đủ.
  - Verify: Load lại trang FE của người dùng để thấy thay đổi ngay lập tức.

### 3.3. Xử lý Trạng thái (UX)
- Đảm bảo hiệu ứng **Syncing...** (Loading) hiển thị đúng trong khi chờ BE phản hồi.
- Thêm thông báo **Toast Notification** (Thành công/Thất bại) thay cho lệnh `alert()` hiện tại.

---

## Giai đoạn 4: Mở rộng (Post-Integration)

1. **Authentication**: Tích hợp Spring Security & JWT để bảo vệ trang Admin.
2. **Media Upload**: Thay thế việc nhập URL ảnh thủ công bằng việc Upload trực tiếp lên Cloudinary/S3 qua module **Media Manager**.
3. **Audit Log**: Ghi lại lịch sử ai đã chỉnh sửa trang nào và vào lúc nào.

---

> [!IMPORTANT]
> **Điểm mấu chốt**: Vì Admin UI hiện tại đã được thiết kế 1:1 với cấu trúc DB, việc tích hợp chủ yếu nằm ở phần logic **Backend Java** để xử lý mảng dữ liệu lồng nhau (Nested lists).
