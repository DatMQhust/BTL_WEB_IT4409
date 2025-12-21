import React from 'react';
import './Book.css';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { useCart } from '../../context/CartContext'; // Import useCart
import 'react-toastify/dist/ReactToastify.css';

// Hình ảnh mặc định nếu sách không có ảnh
import defaultBookImage from '../../assets/website/logo.png';

const Book = ({ book, onBookSelect }) => {
    const { addToCart } = useCart(); // Lấy hàm addToCart từ context

    // Logic xử lý khi nhấn nút "Thêm vào giỏ"
    const handleAddToCart = (e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra card cha
        addToCart(book._id); // Sử dụng hàm từ context
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
        <div className="book-card-link" onClick={() => onBookSelect(book)}>
            <div className="book-card">
                <div className="book-image-container">
                    <img
                        src={book.coverImageUrl || defaultBookImage}
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
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    );
};

export default Book;