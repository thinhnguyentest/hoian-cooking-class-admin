# HƯỚNG DẪN MAPPING DỮ LIỆU CMS (ADMIN -> USER UI)

Tài liệu này giải thích cách các trường dữ liệu trong trang quản trị (Admin CMS) hiển thị trên giao diện người dùng (Frontend - FE).

---

## 1. Page Subject (Thông tin nhận diện trang)

Phần này định danh trang và cung cấp thông tin cơ bản cho SEO.

| Trường trên Admin | Thuộc tính DB | Hiển thị trên FE |
| :--- | :--- | :--- |
| **Page Title** | `title` | Tiêu đề lớn (`H2`) trong phần mô tả trang và tiêu đề chính của trang. |
| **Reference Slug** | `slug` | Đường dẫn URL (Ví dụ: `/food-tour`, `/making-lantern`). |
| **SEO Description** | `description` | Đoạn văn bản mô tả ngắn (Sub-title) ngay dưới tiêu đề chính của trang. |

---

## 2. Page Content (Nội dung trang)

Giao diện đã được tối giản để quản lý 3 thành phần nội dung chính của mọi trải nghiệm (như Cooking Class, Food Tour):

| Phân vùng nội dung | Hiển thị trên UI (Frontend) |
| :--- | :--- |
| **Introduction** | Đoạn văn dẫn dắt đầu tiên ngay sau tiêu đề chính, giới thiệu tổng quan về lớp học/tour. |
| **Experience** | Các đoạn văn bản mô tả chi tiết quy trình, cảm xúc nằm trong phần "What you will experience". |
| **Highlight** | Hiển thị dưới dạng các **dấu gạch đầu dòng (Bullet points)** trong phần "Highlights". |

*Lưu ý: Không còn dùng Display Layer hay Heading phụ để đơn giản hóa quá trình biên tập.*

---

## 3. Product & Dish Menu (Thực đơn & Hoạt động)

Dành cho danh sách các món ăn thực hành hoặc các công đoạn làm nghề truyền thống.

*   **Dish Name (`name`)**: Hiển thị dưới dạng danh sách gạch đầu dòng phía sau nội dung Experience.
*   **Description (`description`)**: Mô tả ngắn về nguyên liệu hoặc thông tin bổ sung của món ăn đó.

---

## Lưu ý kỹ thuật cho Người quản trị

1.  **Tự động ánh xạ**: Hệ thống sẽ tự động gán đúng loại (Intro/Exp/Highlight) cho dữ liệu khi lưu vào database.
2.  **Định dạng văn bản**: Với các trường nội dung dài, bạn có thể dùng `\n` để xuống dòng thủ công.
3.  **Quản lý ảnh**: Các tệp tin hình ảnh hiện được quản lý tại module **Media Manager** riêng biệt để tối ưu việc tái sử dụng hình ảnh.
