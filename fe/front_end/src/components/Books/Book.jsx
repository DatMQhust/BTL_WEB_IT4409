import React, { useState } from 'react';
import './Book.css';
import './FlyToCart.css';
import { FaShoppingCart, FaStar, FaCheck } from 'react-icons/fa';
import { useCart } from '../../context/CartContext'; // Import useCart
import 'react-toastify/dist/ReactToastify.css';

// Hình ảnh mặc định nếu sách không có ảnh
import defaultBookImage from '../../assets/website/logo.png';

const Book = ({ book, onBookSelect }) => {
    const { addToCart } = useCart(); // Lấy hàm addToCart từ context
    const [isAdding, setIsAdding] = useState(false);
    const [justAdded, setJustAdded] = useState(false);

    // Tạo hiệu ứng ripple khi click
    const createRipple = (event) => {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('button-ripple');

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    };

    // Tạo hiệu ứng bay lên giỏ hàng
    const createFlyingImage = (imageUrl, startX, startY) => {
        const cartIcon = document.querySelector('.cart-icon-wrapper');
        if (!cartIcon) return;

        const cartRect = cartIcon.getBoundingClientRect();
        const flyingItem = document.createElement('div');
        flyingItem.className = 'flying-item';
        flyingItem.innerHTML = `<img src="${imageUrl}" alt="Flying item" />`;
        
        flyingItem.style.left = `${startX}px`;
        flyingItem.style.top = `${startY}px`;
        flyingItem.style.setProperty('--x-distance', `${cartRect.left - startX}px`);
        flyingItem.style.setProperty('--y-distance', `${cartRect.top - startY}px`);

        document.body.appendChild(flyingItem);

        setTimeout(() => {
            flyingItem.remove();
        }, 1000);
    };

    // Logic xử lý khi nhấn nút "Thêm vào giỏ"
    const handleAddToCart = async (e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra card cha
        
        if (isAdding || justAdded) return;
        
        // Tạo ripple effect
        createRipple(e);
        
        // Lấy vị trí của ảnh sản phẩm
        const imgElement = e.currentTarget.closest('.book-card').querySelector('.book-image');
        if (imgElement) {
            const rect = imgElement.getBoundingClientRect();
            createFlyingImage(
                book.coverImageUrl || defaultBookImage,
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
        }
        
        setIsAdding(true);
        await addToCart(book._id); // Sử dụng hàm từ context
        setIsAdding(false);
        setJustAdded(true);
        
        // Reset trạng thái sau 2 giây
        setTimeout(() => {
            setJustAdded(false);
        }, 2000);
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
                <button 
                    className={`add-to-cart-button ${isAdding ? 'adding' : ''} ${justAdded ? 'added' : ''}`}
                    onClick={handleAddToCart}
                    disabled={isAdding || justAdded}
                >
                    {justAdded ? (
                        <>
                            <FaCheck /> Đã thêm
                        </>
                    ) : isAdding ? (
                        'Đang thêm...'
                    ) : (
                        <>
                            <FaShoppingCart /> Thêm vào giỏ
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Book;