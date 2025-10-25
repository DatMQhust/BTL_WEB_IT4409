# 📚 SERVER (EXPRESSJS - BOOK ECOMMERCE BTL)

Dự án Backend cho hệ thống Book E-commerce. Phát triển bằng ExpressJS, sử dụng MongoDB Atlas.

---

## 🚀 TRẠNG THÁI DỰ ÁN (END OF DAY 1)

Server đã được cấu hình và **khởi động thành công** tại môi trường phát triển (Development).

* **PORT:** Đang chạy tại `http://localhost:8080`
* **Database:** Đã kết nối thành công tới MongoDB Atlas (`bookEcomerce`).

### 🔑 TÍNH NĂNG ĐÃ HOÀN THÀNH (NGÀY 1: CORE AUTH)

Tất cả các tính năng cốt lõi về xác thực người dùng đã được triển khai và bảo vệ:

| Tính năng | Endpoint | Phương thức | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Đăng ký** | `/api/auth/register` | `POST` | ✅ Hoàn thành |
| **Đăng nhập** | `/api/auth/login` | `POST` | ✅ Hoàn thành |
| **Quên Mật khẩu** | `/api/auth/forgot-password` | `POST` | ✅ Hoàn thành (có gửi email qua Mailtrap) |
| **Reset Mật khẩu** | `/api/auth/reset-password/:token` | `PATCH` | ✅ Hoàn thành |
| **Bảo vệ Route** | `/api/test` (Ví dụ) | `GET` | ✅ Đã bảo vệ bằng JWT |

---

## 🛠️ HƯỚNG DẪN KHỞI ĐỘNG

1.  **Cài đặt Dependencies:**
    ```bash
    npm install
    ```
2.  **Cấu hình Môi trường:** Tạo và điền đầy đủ các biến vào file `.env` (JWT, MongoDB URI, Mailtrap SMTP).
3.  **Khởi động Server:**
    ```bash
    npm run dev
    ```

## 📝 KẾ HOẠCH TIẾP THEO

| Ngày | Mục tiêu | Thư viện chính |
| :--- | :--- | :--- |
| **Ngày 2** | Nâng cấp Đăng ký/Đăng nhập bằng Số điện thoại (Phone) và Xác thực bằng OTP. | `twilio` |
| **Ngày 3** | Thêm Captcha (reCAPTCHA) và tích hợp Đăng nhập bằng bên thứ 3 (Google, Facebook, X) (Social Login - OAuth). | `axios`, `passport.js` |