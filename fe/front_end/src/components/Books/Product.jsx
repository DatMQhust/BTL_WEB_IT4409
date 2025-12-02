import React from 'react';
import './Product.css';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Hình ảnh mặc định nếu sách không có ảnh
import defaultBookImage from '../../assets/website/logo.png';

const Product = ({ product }) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    // Logic xử lý khi nhấn nút "Thêm vào giỏ"
    const handleAddToCart = () => {
        console.log(`Đã thêm sản phẩm "${product.name}" vào giỏ hàng.`);
        // TODO: Tại đây, bạn sẽ thêm logic thực tế để gọi API /api/cart
        // Ví dụ: addToCart(product._id, 1);
    };

    // Tính toán giá sau khi đã giảm
    const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

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
        <Link to={`/product/${product._id}`} className="product-card-link">
            <div className="product-card">
                <div className="product-image-container">
                    <img
                        src={(product.images && product.images[0]) ? product.images[0] : defaultBookImage}
                        alt={product.name}
                        className="product-image"
                    />
                    {product.discount > 0 && <span className="product-discount-badge">{product.discount}% OFF</span>}
                </div>
                <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-author">Tác giả: {product.authors?.map(a => a.name).join(', ') || 'Chưa xác định'}</p>
                    <div className="product-rating">
                        {renderRating(product.rating)}
                    </div>
                    <div className="product-price">
                        {product.discount > 0 && (
                            <span className="original-price">{product.price.toLocaleString('vi-VN')}đ</span>
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

export default Product;