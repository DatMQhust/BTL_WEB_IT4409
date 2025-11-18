# Tài liệu API

Dự án này sử dụng một base path là `/api` cho tất cả các routes.

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`

Đăng ký tài khoản người dùng mới.

-   **Tham số (Body):**
    -   `name` (String, Bắt buộc): Tên người dùng.
    -   `email` (String, Tùy chọn): Email người dùng.
    -   `phone` (String, Tùy chọn): Số điện thoại người dùng (định dạng `+84...`).
    -   `password` (String, Bắt buộc): Mật khẩu (tối thiểu 8 ký tự).
    -   `passwordConfirm` (String, Bắt buộc): Xác nhận mật khẩu.
    *Lưu ý: Phải cung cấp `email` hoặc `phone`.*

-   **Kết quả thành công (201):**
    -   Nếu đăng ký bằng email, trả về thông tin người dùng và token JWT.
    -   Nếu đăng ký bằng SĐT, trả về thông báo yêu cầu xác thực OTP.

    ```json
    {
        "status": "success",
        "token": "your_jwt_token",
        "data": {
            "user": {
                "_id": "userId",
                "name": "Test User",
                "email": "test@example.com",
                "phone": "+84123456789",
                "isPhoneVerified": false
            }
        }
    }
    ```

### `POST /api/auth/login`

Đăng nhập vào hệ thống.

-   **Tham số (Body):**
    -   `identifier` (String, Bắt buộc): Email hoặc số điện thoại của người dùng.
    -   `password` (String, Bắt buộc): Mật khẩu.

-   **Kết quả thành công (200):**
    -   Trả về thông tin người dùng và token JWT.

    ```json
    {
        "status": "success",
        "token": "your_jwt_token",
        "data": {
            "user": {
                "_id": "userId",
                "name": "Test User",
                "email": "test@example.com"
            }
        }
    }
    ```

### `POST /api/auth/verify-phone`

Xác thực số điện thoại bằng mã OTP.

-   **Tham số (Body):**
    -   `phone` (String, Bắt buộc): Số điện thoại đã đăng ký.
    -   `code` (String, Bắt buộc): Mã OTP nhận được.

-   **Kết quả thành công (200):**
    -   Trả về thông tin người dùng và token JWT sau khi xác thực thành công.

### `POST /api/auth/forgot-password`

Yêu cầu reset mật khẩu qua email.

-   **Tham số (Body):**
    -   `email` (String, Bắt buộc): Email đã đăng ký.

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "message": "Token reset mật khẩu đã được gửi tới email!"
    }
    ```

### `PATCH /api/auth/reset-password/:token`

Đặt lại mật khẩu mới bằng token đã nhận.

-   **Tham số (URL):**
    -   `token` (String, Bắt buộc): Token reset nhận được từ email.
-   **Tham số (Body):**
    -   `password` (String, Bắt buộc): Mật khẩu mới.
    -   `passwordConfirm` (String, Bắt buộc): Xác nhận mật khẩu mới.

-   **Kết quả thành công (200):**
    -   Trả về thông tin người dùng và token JWT mới.

---

## 2. Products (`/api/product`)

### `GET /api/product`

Lấy danh sách sản phẩm.

-   **Tham số (Query):**
    -   `page` (Number, Tùy chọn, Mặc định: 1): Số trang.
    -   `limit` (Number, Tùy chọn, Mặc định: 10): Số lượng sản phẩm mỗi trang.

-   **Kết quả thành công (200):**
    -   Trả về một mảng các sản phẩm.

    ```json
    [
        {
            "_id": "productId",
            "name": "Tên sản phẩm",
            "price": 100000,
            "discount": 10,
            "description": "Mô tả sản phẩm",
            "categoryId": "categoryId",
            "authors": ["authorId1", "authorId2"],
            "rating": 4.5,
            "inStock": 100
        }
    ]
    ```

### `POST /api/product`

Tạo một sản phẩm mới (Yêu cầu quyền admin).

-   **Tham số (Body):**
    -   `name` (String, Bắt buộc)
    -   `price` (Number, Bắt buộc)
    -   `description` (String)
    -   `categoryId` (ObjectId, Bắt buộc)
    -   `authors` (Array of ObjectId)
    -   `inStock` (Number)
    -   ... (và các trường khác trong `product.model.js`)

-   **Kết quả thành công (201):**
    -   Trả về đối tượng sản phẩm vừa tạo.

### `GET /api/product/:id`

Lấy thông tin chi tiết một sản phẩm.

-   **Tham số (URL):**
    -   `id` (ObjectId, Bắt buộc): ID của sản phẩm.

-   **Kết quả thành công (200):**
    -   Trả về đối tượng sản phẩm.

### `PUT /api/product/:id`

Cập nhật thông tin sản phẩm (Yêu cầu quyền admin).

-   **Tham số (URL):**
    -   `id` (ObjectId, Bắt buộc): ID của sản phẩm.
-   **Tham số (Body):**
    -   Các trường thông tin sản phẩm cần cập nhật.

-   **Kết quả thành công (200):**
    -   Trả về đối tượng sản phẩm đã được cập nhật.

### `DELETE /api/product/:id`

Xóa một sản phẩm (Yêu cầu quyền admin).

-   **Tham số (URL):**
    -   `id` (ObjectId, Bắt buộc): ID của sản phẩm.

-   **Kết quả thành công (200):**
    -   Trả về đối tượng sản phẩm đã bị xóa.

---

## 3. Authors (`/api/author`)

Tương tự như Products, bao gồm các API:
-   `GET /api/author`: Lấy danh sách tác giả.
-   `POST /api/author`: Tạo tác giả mới.
-   `GET /api/author/:id`: Lấy chi tiết tác giả.
-   `PUT /api/author/:id`: Cập nhật tác giả.
-   `DELETE /api/author/:id`: Xóa tác giả.

-   **Đối tượng Author:**
    ```json
    {
        "_id": "authorId",
        "name": "Tên tác giả",
        "biography": "Tiểu sử",
        "nationality": "Quốc tịch",
        "books": ["productId1", "productId2"]
    }
    ```

---

## 4. Categories (`/api/category`)

Tương tự như Products, bao gồm các API:
-   `GET /api/category`: Lấy danh sách danh mục.
-   `POST /api/category`: Tạo danh mục mới.
-   `GET /api/category/:id`: Lấy chi tiết danh mục.
-   `PUT /api/category/:id`: Cập nhật danh mục.
-   `DELETE /api/category/:id`: Xóa danh mục.

-   **Đối tượng Category:**
    ```json
    {
        "_id": "categoryId",
        "name": "Tên danh mục",
        "slug": "ten-danh-muc",
        "description": "Mô tả danh mục",
        "parentCategory": "parentCategoryId"
    }
    ```

---

## 5. Reviews (`/api/reviews`)

### `POST /api/reviews`

Tạo một đánh giá mới cho sản phẩm (Yêu cầu đăng nhập).

-   **Header:**
    -   `Authorization`: `Bearer your_jwt_token`
-   **Tham số (Body):**
    -   `productId` (ObjectId, Bắt buộc): ID sản phẩm được đánh giá.
    -   `rating` (Number, Bắt buộc): Điểm đánh giá (1-5).
    -   `comment` (String): Bình luận.

-   **Kết quả thành công (201):**
    -   Trả về đối tượng review vừa tạo.
    ```json
    {
        "_id": "reviewId",
        "rating": 5,
        "comment": "Sản phẩm rất tốt!",
        "userId": "userId",
        "productId": "productId"
    }
    ```

### `GET /api/reviews/product/:productId`

Lấy tất cả đánh giá của một sản phẩm.

-   **Tham số (URL):**
    -   `productId` (ObjectId, Bắt buộc): ID của sản phẩm.
-   **Tham số (Query):**
    -   `page`, `limit`

-   **Kết quả thành công (200):**
    -   Trả về một mảng các đánh giá.

### `DELETE /api/reviews/:id`

Xóa một đánh giá (Yêu cầu đăng nhập và là chủ sở hữu review hoặc admin).

-   **Header:**
    -   `Authorization`: `Bearer your_jwt_token`
-   **Tham số (URL):**
    -   `id` (ObjectId, Bắt buộc): ID của review.

-   **Kết quả thành công (200):**
    -   Trả về đối tượng review đã bị xóa.

---

## 6. Cart (`/api/cart`)

Tất cả các API trong mục này đều yêu cầu đăng nhập (`Authorization: Bearer your_jwt_token`).

### `GET /api/cart`

Lấy thông tin giỏ hàng của người dùng hiện tại.

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "data": {
            "cart": [
                {
                    "product": {
                        "_id": "productId",
                        "name": "Tên sản phẩm",
                        "price": 100000,
                        "images": ["url1", "url2"],
                        "stock": 50
                    },
                    "quantity": 2,
                    "_id": "cartItemId"
                }
            ]
        }
    }
    ```

### `POST /api/cart`

Thêm sản phẩm vào giỏ hàng.

-   **Tham số (Body):**
    -   `productId` (ObjectId, Bắt buộc): ID sản phẩm.
    -   `quantity` (Number, Tùy chọn, Mặc định: 1): Số lượng.

-   **Kết quả thành công (200):**
    -   Trả về giỏ hàng đã được cập nhật.

### `PATCH /api/cart/:productId`

Cập nhật số lượng của một sản phẩm trong giỏ hàng.

-   **Tham số (URL):**
    -   `productId` (ObjectId, Bắt buộc): ID sản phẩm trong giỏ hàng.
-   **Tham số (Body):**
    -   `quantity` (Number, Bắt buộc): Số lượng mới (phải >= 1).

-   **Kết quả thành công (200):**
    -   Trả về giỏ hàng đã được cập nhật.

### `DELETE /api/cart/:productId`

Xóa một sản phẩm khỏi giỏ hàng.

-   **Tham số (URL):**
    -   `productId` (ObjectId, Bắt buộc): ID sản phẩm cần xóa.

-   **Kết quả thành công (200):**
    -   Trả về giỏ hàng đã được cập nhật.
