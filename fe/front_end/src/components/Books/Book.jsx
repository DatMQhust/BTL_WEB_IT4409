import React from 'react';
import './Book.css';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Hình ảnh mặc định nếu sách không có ảnh
import defaultBookImage from '../../assets/website/logo.png';

const Book = ({ book }) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    // Logic xử lý khi nhấn nút "Thêm vào giỏ"
    const handleAddToCart = () => {
        console.log(`Đã thêm sách "${book.name}" vào giỏ hàng.`);
        // TODO: Tại đây, bạn sẽ thêm logic thực tế để gọi API /api/cart
        // Ví dụ: addToCart(book._id, 1);
    };

    // Tính toán giá sau khi đã giảm
    const discountedPrice = book.price * (1 - (book.discount || 0) / 100);

    // Hàm để hiển thị các ngôi sao đánh giá
    const renderRating = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar key={i} className={i <= rating ? 'star-filled' : 'star-empty'} />
            );
        }
        return stars;
    };

    return (
        <Link to={`/product/${book._id}`} className="book-card-link">
            <div className="book-card">
                <div className="book-image-container">
                    <img
                        src={(book.images && book.images[0]) ? book.images[0] : defaultBookImage}
                        alt={book.name}
                        className="book-image"
                    />
                    {book.discount > 0 && <span className="book-discount-badge">{book.discount}% OFF</span>}
                </div>
                <div className="book-info">
                    <h3 className="book-title">{book.name}</h3>
                    <p className="book-author">Tác giả: {book.authors?.map(a => a.name).join(', ') || 'Chưa xác định'}</p>
                    <div className="book-rating">
                        {renderRating(book.rating)}
                    </div>
                    <div className="book-price">
                        {book.discount > 0 && (
                            <span className="original-price">{book.price.toLocaleString('vi-VN')}đ</span>
                        )}
                        <span className="current-price">{discountedPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                </div>
                <button className="add-to-cart-button" onClick={handleAddToCart}>
                    <FaShoppingCart />
                    <span>Thêm vào giỏ</span>
                </button>
            </div>
        </Link>
    );
};

export default Book;