# Tài liệu API

Dự án này sử dụng một base path là `/api` cho tất cả các routes.

**Base URL:** `http://localhost:5000/api`

---

## 📋 Mục lục

1. [Authentication](#1-authentication-apiauth)
2. [Products](#2-products-apiproduct)
3. [Authors](#3-authors-apiauthor)
4. [Categories](#4-categories-apicategory)
5. [Reviews](#5-reviews-apireviews)
6. [Cart](#6-cart-apicart)
7. [Orders](#7-orders-apiorders)
8. [Admin](#8-admin-apiadmin)
9. [Authorization & Roles](#9-authorization--roles)

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
    
    *Lưu ý: Phải cung cấp `email` hoặc `phone`. User mới sẽ có role mặc định là "user".*

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
                "role": "user",
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
    ```json
    {
        "status": "success",
        "token": "your_jwt_token",
        "data": {
            "user": {
                "_id": "userId",
                "name": "Test User",
                "email": "test@example.com",
                "role": "user"
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

Lấy danh sách sản phẩm với search, filter, sort và pagination.

-   **Tham số (Query):**
    -   `page` (Number, Mặc định: 1): Số trang.
    -   `limit` (Number, Mặc định: 10): Số lượng sản phẩm mỗi trang.
    -   `search` (String): Tìm kiếm theo tên, mô tả, hoặc ISBN.
    -   `categoryId` (ObjectId): Lọc theo danh mục.
    -   `authorId` (ObjectId): Lọc theo tác giả.
    -   `minPrice` (Number): Giá tối thiểu.
    -   `maxPrice` (Number): Giá tối đa.
    -   `minRating` (Number): Rating tối thiểu (1-5).
    -   `inStock` (Boolean): `true` để chỉ hiển thị sản phẩm còn hàng.
    -   `sort` (String): Sắp xếp theo:
        -   `price_asc`: Giá tăng dần
        -   `price_desc`: Giá giảm dần
        -   `rating`: Rating cao nhất
        -   `bestseller`: Bán chạy nhất
        -   `name`: Tên A-Z
        -   Mặc định: Mới nhất

-   **Ví dụ:**
    ```
    GET /api/product?search=harry&minPrice=50000&maxPrice=200000&sort=price_asc&page=1&limit=10&inStock=true
    ```

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "results": 10,
        "data": {
            "products": [
                {
                    "_id": "productId",
                    "name": "Tên sản phẩm",
                    "slug": "ten-san-pham",
                    "price": 150000,
                    "discount": 10,
                    "description": "Mô tả sản phẩm",
                    "categoryId": {
                        "_id": "categoryId",
                        "name": "Tiểu thuyết",
                        "slug": "tieu-thuyet"
                    },
                    "authors": [
                        {
                            "_id": "authorId",
                            "name": "J.K. Rowling",
                            "slug": "jk-rowling"
                        }
                    ],
                    "publisher": "Bloomsbury",
                    "isbn": "978-0439708180",
                    "coverImageUrl": "https://example.com/image.jpg",
                    "rating": 4.5,
                    "inStock": 100,
                    "sold": 250,
                    "createdAt": "2025-12-01T00:00:00.000Z"
                }
            ],
            "pagination": {
                "page": 1,
                "limit": 10,
                "total": 45,
                "totalPages": 5
            }
        }
    }
    ```

### `GET /api/product/:id`

Lấy thông tin chi tiết một sản phẩm.

-   **Tham số (URL):**
    -   `id` (ObjectId, Bắt buộc): ID của sản phẩm.

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "data": {
            "product": {
                "_id": "productId",
                "name": "Harry Potter và Hòn đá phù thủy",
                "slug": "harry-potter-va-hon-da-phu-thuy",
                "price": 150000,
                "discount": 10,
                "description": "Cuốn sách đầu tiên...",
                "categoryId": { ... },
                "authors": [ ... ],
                "publisher": "Bloomsbury",
                "publicationDate": "1997-06-26",
                "isbn": "978-0439708180",
                "coverImageUrl": "https://...",
                "gallery": ["url1", "url2"],
                "rating": 4.8,
                "inStock": 50,
                "sold": 1200
            }
        }
    }
    ```

-   **Lỗi (404):**
    ```json
    {
        "status": "error",
        "message": "Sản phẩm không tồn tại"
    }
    ```

### `POST /api/product` 🔐 Admin Only

Tạo một sản phẩm mới.

-   **Headers:**
    -   `Authorization`: `Bearer your_jwt_token` (Admin role required)

-   **Tham số (Body):**
    -   `name` (String, Bắt buộc): Tên sản phẩm.
    -   `price` (Number, Bắt buộc): Giá sản phẩm.
    -   `discount` (Number, 0-100): Phần trăm giảm giá.
    -   `description` (String): Mô tả sản phẩm.
    -   `categoryId` (ObjectId, Bắt buộc): ID danh mục.
    -   `authors` (Array): Mảng object `[{ name: "Tên tác giả" }]`. Hệ thống sẽ tự tạo author mới nếu chưa tồn tại.
    -   `publisher` (String): Nhà xuất bản.
    -   `publicationDate` (Date): Ngày xuất bản.
    -   `isbn` (String): Mã ISBN.
    -   `coverImageUrl` (String): URL ảnh bìa.
    -   `gallery` (Array of String): Mảng URL ảnh.
    -   `inStock` (Number): Số lượng trong kho.
    -   `slug` (String, Tùy chọn): Tự động tạo từ name nếu không cung cấp.

-   **Kết quả thành công (201):**
    ```json
    {
        "status": "success",
        "data": {
            "product": { ... }
        }
    }
    ```

### `PUT /api/product/:id` 🔐 Admin Only

Cập nhật thông tin sản phẩm.

-   **Headers:**
    -   `Authorization`: `Bearer your_jwt_token` (Admin role required)

-   **Tham số (URL):**
    -   `id` (ObjectId, Bắt buộc): ID của sản phẩm.

-   **Tham số (Body):**
    -   Các trường cần cập nhật (giống POST).

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "data": {
            "product": { ... }
        }
    }
    ```

### `DELETE /api/product/:id` 🔐 Admin Only

Xóa một sản phẩm.

-   **Headers:**
    -   `Authorization`: `Bearer your_jwt_token` (Admin role required)

-   **Tham số (URL):**
    -   `id` (ObjectId, Bắt buộc): ID của sản phẩm.

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "message": "Đã xóa sản phẩm thành công",
        "data": {
            "product": { ... }
        }
    }
    ```

---

## 3. Authors (`/api/author`)

### `GET /api/author`

Lấy danh sách tác giả với pagination.

-   **Tham số (Query):**
    -   `page` (Number, Mặc định: 1)
    -   `limit` (Number, Mặc định: 10)

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "results": 10,
        "data": {
            "authors": [
                {
                    "_id": "authorId",
                    "name": "J.K. Rowling",
                    "slug": "jk-rowling",
                    "biography": "Tiểu sử...",
                    "nationality": "British",
                    "dateOfBirth": "1965-07-31",
                    "totalBooks": 15,
                    "followers": 1000000
                }
            ],
            "pagination": {
                "page": 1,
                "limit": 10,
                "total": 50,
                "totalPages": 5
            }
        }
    }
    ```

### `GET /api/author/:id`

Lấy chi tiết tác giả.

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "data": {
            "author": {
                "_id": "authorId",
                "name": "J.K. Rowling",
                "slug": "jk-rowling",
                "biography": "...",
                "books": [
                    {
                        "_id": "productId",
                        "name": "Harry Potter",
                        "slug": "harry-potter",
                        "coverImageUrl": "..."
                    }
                ]
            }
        }
    }
    ```

### `POST /api/author` 🔐 Admin Only

Tạo tác giả mới.

-   **Headers:** `Authorization: Bearer your_jwt_token`
-   **Body:** `name` (required), `biography`, `nationality`, `dateOfBirth`, `avatar`

### `PUT /api/author/:id` 🔐 Admin Only

Cập nhật tác giả.

### `DELETE /api/author/:id` 🔐 Admin Only

Xóa tác giả.

---

## 4. Categories (`/api/category`)

### `GET /api/category`

Lấy danh sách danh mục.

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "results": 15,
        "data": {
            "categories": [
                {
                    "_id": "categoryId",
                    "name": "Tiểu thuyết",
                    "slug": "tieu-thuyet",
                    "description": "...",
                    "parentCategory": null,
                    "imageUrl": "..."
                }
            ]
        }
    }
    ```

### `GET /api/category/:id`

Lấy chi tiết danh mục.

### `POST /api/category` 🔐 Admin Only

Tạo danh mục mới.

-   **Headers:** `Authorization: Bearer your_jwt_token`
-   **Body:** `name` (required), `description`, `parentCategory`, `imageUrl`

### `PUT /api/category/:id` 🔐 Admin Only

Cập nhật danh mục.

### `DELETE /api/category/:id` 🔐 Admin Only

Xóa danh mục.

---

## 5. Reviews (`/api/reviews`)

### `GET /api/reviews/product/:productId`

Lấy tất cả đánh giá của một sản phẩm.

-   **Tham số (URL):**
    -   `productId` (ObjectId, Bắt buộc)

-   **Tham số (Query):**
    -   `page` (Number, Mặc định: 1)
    -   `limit` (Number, Mặc định: 10)

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "results": 10,
        "data": {
            "reviews": [
                {
                    "_id": "reviewId",
                    "rating": 5,
                    "comment": "Sản phẩm rất tốt!",
                    "userId": {
                        "_id": "userId",
                        "name": "Nguyen Van A"
                    },
                    "productId": "productId",
                    "createdAt": "2025-12-01T00:00:00.000Z"
                }
            ],
            "pagination": {
                "page": 1,
                "limit": 10,
                "total": 45,
                "totalPages": 5
            }
        }
    }
    ```

### `POST /api/reviews` 🔐 Authenticated

Tạo đánh giá mới cho sản phẩm.

-   **Headers:**
    -   `Authorization`: `Bearer your_jwt_token`

-   **Tham số (Body):**
    -   `productId` (ObjectId, Bắt buộc): ID sản phẩm.
    -   `rating` (Number, Bắt buộc): Điểm đánh giá (1-5).
    -   `comment` (String): Bình luận.

-   **Kết quả thành công (201):**
    ```json
    {
        "status": "success",
        "data": {
            "review": {
                "_id": "reviewId",
                "rating": 5,
                "comment": "Rất hay!",
                "userId": "userId",
                "productId": "productId"
            }
        }
    }
    ```

### `DELETE /api/reviews/:id` 🔐 Authenticated

Xóa một đánh giá (phải là chủ sở hữu hoặc admin).

-   **Headers:**
    -   `Authorization`: `Bearer your_jwt_token`

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "message": "Đã xóa review thành công",
        "data": {
            "review": { ... }
        }
    }
    ```

---

## 6. Cart (`/api/cart`)

**Tất cả các API trong mục này yêu cầu đăng nhập.**

### `GET /api/cart` 🔐

Lấy giỏ hàng của người dùng hiện tại.

-   **Headers:**
    -   `Authorization`: `Bearer your_jwt_token`

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "data": {
            "cart": [
                {
                    "product": {
                        "_id": "productId",
                        "name": "Harry Potter",
                        "price": 150000,
                        "coverImageUrl": "...",
                        "inStock": 50
                    },
                    "quantity": 2,
                    "_id": "cartItemId"
                }
            ]
        }
    }
    ```

### `POST /api/cart` 🔐

Thêm sản phẩm vào giỏ hàng.

-   **Headers:**
    -   `Authorization`: `Bearer your_jwt_token`

-   **Tham số (Body):**
    -   `productId` (ObjectId, Bắt buộc): ID sản phẩm.
    -   `quantity` (Number, Mặc định: 1): Số lượng.

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "message": "Sản phẩm đã được thêm vào giỏ hàng.",
        "data": {
            "cart": [ ... ]
        }
    }
    ```

-   **Lỗi (400):**
    ```json
    {
        "status": "error",
        "message": "Sản phẩm không đủ số lượng trong kho."
    }
    ```

### `PATCH /api/cart/:productId` 🔐

Cập nhật số lượng sản phẩm trong giỏ hàng.

-   **Headers:**
    -   `Authorization`: `Bearer your_jwt_token`

-   **Tham số (URL):**
    -   `productId` (ObjectId, Bắt buộc)

-   **Tham số (Body):**
    -   `quantity` (Number, Bắt buộc): Số lượng mới (>= 1).

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "message": "Giỏ hàng đã được cập nhật.",
        "data": {
            "cart": [ ... ]
        }
    }
    ```

### `DELETE /api/cart/:productId` 🔐

Xóa sản phẩm khỏi giỏ hàng.

-   **Headers:**
    -   `Authorization`: `Bearer your_jwt_token`

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "message": "Sản phẩm đã được xóa khỏi giỏ hàng.",
        "data": {
            "cart": [ ... ]
        }
    }
    ```

---

## 7. Orders (`/api/orders`)

**Tất cả các API trong mục này yêu cầu đăng nhập.**

### `POST /api/orders` 🔐

Tạo đơn hàng từ giỏ hàng hiện tại.

-   **Headers:**
    -   `Authorization`: `Bearer your_jwt_token`

-   **Tham số (Body):**
    -   `shippingAddress` (Object, Bắt buộc):
        -   `fullName` (String, Bắt buộc)
        -   `address` (String, Bắt buộc)
        -   `city` (String, Bắt buộc)
        -   `postalCode` (String, Bắt buộc)
        -   `country` (String, Bắt buộc)
        -   `phone` (String, Bắt buộc)
    -   `paymentMethod` (String, Bắt buộc): `"COD"` hoặc `"Card"`

-   **Kết quả thành công (201):**
    ```json
    {
        "status": "success",
        "data": {
            "order": {
                "_id": "orderId",
                "user": "userId",
                "items": [
                    {
                        "product": "productId",
                        "name": "Harry Potter",
                        "quantity": 2,
                        "price": 150000
                    }
                ],
                "totalAmount": 300000,
                "shippingAddress": { ... },
                "paymentMethod": "COD",
                "paymentStatus": "pending",
                "status": "pending",
                "createdAt": "2025-12-07T00:00:00.000Z"
            }
        }
    }
    ```

-   **Lỗi (400):**
    ```json
    {
        "status": "error",
        "message": "Giỏ hàng của bạn đang trống."
    }
    ```
    hoặc
    ```json
    {
        "status": "error",
        "message": "Sản phẩm \"Harry Potter\" không đủ hàng."
    }
    ```

### `GET /api/orders/my-orders` 🔐

Lấy danh sách đơn hàng của người dùng hiện tại.

-   **Headers:**
    -   `Authorization`: `Bearer your_jwt_token`

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "results": 5,
        "data": {
            "orders": [
                {
                    "_id": "orderId",
                    "items": [ ... ],
                    "totalAmount": 300000,
                    "status": "delivered",
                    "paymentStatus": "paid",
                    "createdAt": "2025-12-01T00:00:00.000Z"
                }
            ]
        }
    }
    ```

### `GET /api/orders/:id` 🔐

Lấy chi tiết một đơn hàng (phải là chủ đơn hàng hoặc admin).

-   **Headers:**
    -   `Authorization`: `Bearer your_jwt_token`

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "data": {
            "order": {
                "_id": "orderId",
                "user": {
                    "_id": "userId",
                    "name": "Nguyen Van A",
                    "email": "user@example.com"
                },
                "items": [ ... ],
                "totalAmount": 300000,
                "shippingAddress": { ... },
                "paymentMethod": "COD",
                "paymentStatus": "pending",
                "status": "processing",
                "createdAt": "2025-12-07T00:00:00.000Z",
                "updatedAt": "2025-12-07T01:00:00.000Z"
            }
        }
    }
    ```

### `GET /api/orders/admin/` 🔐 Admin Only

Lấy tất cả đơn hàng (admin only).

-   **Headers:**
    -   `Authorization`: `Bearer your_admin_jwt_token`

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "results": 100,
        "data": {
            "orders": [ ... ]
        }
    }
    ```

### `PATCH /api/orders/admin/:id` 🔐 Admin Only

Cập nhật trạng thái đơn hàng (admin only).

-   **Headers:**
    -   `Authorization`: `Bearer your_admin_jwt_token`

-   **Tham số (Body):**
    -   `status` (String, Bắt buộc): `"pending"`, `"processing"`, `"shipped"`, `"delivered"`, hoặc `"cancelled"`

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "data": {
            "order": { ... }
        }
    }
    ```

---

## 8. Authorization & Roles

### Vai trò người dùng (Roles)

Hệ thống có 2 loại role:
- **`user`**: Người dùng thông thường (mặc định khi đăng ký)
- **`admin`**: Quản trị viên

### Protected Routes

Routes yêu cầu authentication (đăng nhập):
- Tất cả routes trong `/api/cart`
- Tất cả routes trong `/api/orders`
- `POST /api/reviews`
- `DELETE /api/reviews/:id`

Routes yêu cầu admin role:
- `POST /api/product`
- `PUT /api/product/:id`
- `DELETE /api/product/:id`
- `POST /api/category`
- `PUT /api/category/:id`
- `DELETE /api/category/:id`
- `POST /api/author`
- `PUT /api/author/:id`
- `DELETE /api/author/:id`
- `GET /api/orders/admin/`
- `PATCH /api/orders/admin/:id`

### Headers Authentication

Để truy cập protected routes, thêm header:
```
Authorization: Bearer your_jwt_token
```

### Error Responses

**401 Unauthorized:**
```json
{
    "status": "error",
    "message": "Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập."
}
```

**403 Forbidden:**
```json
{
    "status": "error",
    "message": "Bạn không có quyền thực hiện hành động này."
}
```

**404 Not Found:**
```json
{
    "status": "error",
    "message": "Sản phẩm không tồn tại"
}
```

**400 Bad Request:**
```json
{
    "status": "error",
    "message": "Vui lòng cung cấp ID sản phẩm."
}
```

---

## 📝 Lưu ý quan trọng

1. **Admin User:** User đầu tiên với role admin phải được tạo manually trong MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Stock Management:** Khi tạo order, `inStock` tự động giảm và `sold` tự động tăng.

3. **Auto-create Authors:** Khi tạo/update product, nếu author chưa tồn tại sẽ được tự động tạo mới.

4. **Rating Calculation:** Rating của product tự động cập nhật khi có review mới/xóa review.

5. **JWT Token:** Token có thời gian hết hạn được cấu hình trong `JWT_EXPIRES_IN` (mặc định: 30d).

6. **Pagination:** Tất cả list APIs đều hỗ trợ pagination với `page` và `limit`.

---

**Last Updated:** December 7, 2025 - Phase 1 Completed

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

### `DELETE /api/cart` 🔐

Xóa toàn bộ giỏ hàng.

-   **Yêu cầu:** Đăng nhập (protect middleware)

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "message": "Giỏ hàng đã được xóa.",
        "data": {
            "cart": {
                "_id": "cartId",
                "user": "userId",
                "items": [],
                "totalItems": 0,
                "totalPrice": 0
            }
        }
    }
    ```

---

## 8. Admin (`/api/admin`) 🔐👑

**Lưu ý:** Tất cả các routes admin yêu cầu đăng nhập và có role `admin`.

### `GET /api/admin/dashboard` 🔐👑

Lấy thống kê tổng quan cho dashboard admin.

-   **Yêu cầu:** Admin role

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "data": {
            "stats": {
                "revenue": {
                    "total": 50000000,
                    "today": 2500000,
                    "thisMonth": 15000000,
                    "thisYear": 45000000
                },
                "orders": {
                    "total": 150,
                    "today": 5,
                    "thisMonth": 45,
                    "byStatus": {
                        "pending": 10,
                        "processing": 15,
                        "shipped": 20,
                        "delivered": 100,
                        "cancelled": 5
                    }
                },
                "customers": {
                    "total": 250,
                    "newToday": 3,
                    "newThisMonth": 25
                },
                "products": {
                    "total": 100,
                    "lowStock": 8,
                    "outOfStock": 2
                }
            }
        }
    }
    ```

### `GET /api/admin/revenue` 🔐👑

Lấy thống kê doanh thu theo khoảng thời gian.

-   **Yêu cầu:** Admin role
-   **Query Parameters:**
    -   `period` (String, Mặc định: 'month'): Khoảng thời gian - 'week', 'month', 'year'
    -   `year` (Number, Tùy chọn): Năm cụ thể (mặc định: năm hiện tại)
    -   `month` (Number, Tùy chọn): Tháng cụ thể (1-12, chỉ dùng khi period='month')

-   **Ví dụ:**
    -   `GET /api/admin/revenue?period=month&year=2024&month=12`
    -   `GET /api/admin/revenue?period=year&year=2024`
    -   `GET /api/admin/revenue?period=week`

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "data": {
            "stats": {
                "period": "month",
                "year": 2024,
                "month": 12,
                "data": [
                    {
                        "period": 1,
                        "revenue": 1200000,
                        "orders": 5
                    },
                    {
                        "period": 2,
                        "revenue": 1500000,
                        "orders": 7
                    }
                ]
            }
        }
    }
    ```

### `GET /api/admin/inventory` 🔐👑

Lấy báo cáo tồn kho chi tiết.

-   **Yêu cầu:** Admin role

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "data": {
            "report": {
                "totalInventoryValue": 125000000,
                "stockLevels": [
                    {
                        "_id": 0,
                        "count": 2,
                        "products": []
                    },
                    {
                        "_id": 1,
                        "count": 5,
                        "products": []
                    }
                ],
                "lowStockProducts": [
                    {
                        "_id": "productId",
                        "name": "Sản phẩm A",
                        "inStock": 5,
                        "price": 100000,
                        "categoryId": {
                            "_id": "categoryId",
                            "name": "Category Name"
                        }
                    }
                ],
                "outOfStockProducts": [
                    {
                        "_id": "productId",
                        "name": "Sản phẩm B",
                        "sold": 150,
                        "price": 200000,
                        "categoryId": {
                            "_id": "categoryId",
                            "name": "Category Name"
                        }
                    }
                ],
                "productsByCategory": [
                    {
                        "_id": "categoryId",
                        "categoryName": "Tiểu thuyết",
                        "count": 25,
                        "totalStock": 500
                    }
                ]
            }
        }
    }
    ```

### `GET /api/admin/best-selling` 🔐👑

Lấy danh sách sản phẩm bán chạy nhất.

-   **Yêu cầu:** Admin role
-   **Query Parameters:**
    -   `limit` (Number, Mặc định: 10): Số lượng sản phẩm trả về
    -   `period` (String, Mặc định: 'all'): Khoảng thời gian - 'all', 'month', 'year'

-   **Ví dụ:**
    -   `GET /api/admin/best-selling?limit=20&period=month`
    -   `GET /api/admin/best-selling?period=year`

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "results": 10,
        "data": {
            "products": [
                {
                    "_id": "productId",
                    "productId": "productId",
                    "name": "Đắc Nhân Tâm",
                    "coverImageUrl": "url",
                    "price": 120000,
                    "inStock": 300,
                    "totalSold": 8900,
                    "totalRevenue": 1068000000,
                    "orderCount": 3500
                }
            ]
        }
    }
    ```

### `GET /api/admin/sales-by-category` 🔐👑

Lấy thống kê doanh thu theo danh mục sản phẩm.

-   **Yêu cầu:** Admin role
-   **Query Parameters:**
    -   `period` (String, Mặc định: 'all'): Khoảng thời gian - 'all', 'month', 'year'

-   **Ví dụ:**
    -   `GET /api/admin/sales-by-category?period=month`

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "results": 5,
        "data": {
            "sales": [
                {
                    "_id": "categoryId",
                    "categoryId": "categoryId",
                    "categoryName": "Kỹ năng sống",
                    "totalRevenue": 25000000,
                    "totalSold": 350,
                    "orderCount": 180
                }
            ]
        }
    }
    ```

### `GET /api/admin/customers` 🔐👑

Lấy thống kê khách hàng.

-   **Yêu cầu:** Admin role

-   **Kết quả thành công (200):**
    ```json
    {
        "status": "success",
        "data": {
            "stats": {
                "topCustomers": [
                    {
                        "_id": "userId",
                        "userId": "userId",
                        "name": "Nguyễn Văn A",
                        "email": "user@example.com",
                        "totalSpent": 5000000,
                        "orderCount": 15
                    }
                ],
                "customerGrowth": [
                    {
                        "_id": 1,
                        "count": 25
                    },
                    {
                        "_id": 2,
                        "count": 30
                    }
                ]
            }
        }
    }
    ```

---

## 9. Authorization & Roles
