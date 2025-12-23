import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Star, X } from "lucide-react";
import { toast } from 'react-toastify';
import "./BookDetailPopup.css";
import { useAuth } from "../../context/AuthContext";
import defaultBookImage from '../../assets/website/logo.png';
import { useCart } from "../../context/CartContext";
import Moment from 'moment';
import ReviewPopup from '../Review/ReviewPopup'; // Import ReviewPopup

const BookDetailPopup = ({ book, onClose }) => {
    // --- GIỮ NGUYÊN LOGIC CẦN THIẾT ---
    const { user } = useAuth();
    const { addToCart: addToCartContext } = useCart();
    const [buyQuantity, setBuyQuantity] = useState(1);
    const [showReviewPopup, setShowReviewPopup] = useState(false); // State for review popup

    const handleSetquantity = (value) => {
        if (value < 1) {
            setBuyQuantity(1);
            return;
        }
        if (book && value > book.inStock) {
            toast.warn(`Chỉ còn ${book.inStock} sản phẩm trong kho.`);
            setBuyQuantity(book.inStock);
            return;
        }
        setBuyQuantity(value);
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }
        addToCartContext(book._id, buyQuantity);
    };

    const navigate = useNavigate();

    const handleBuyNow = () => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để mua hàng.");
            return;
        }

        const finalPrice = book.discount
            ? book.price * (1 - book.discount / 100)
            : book.price;

        const directItems = [{
            product: book,
            quantity: buyQuantity,
            price: finalPrice
        }];

        onClose();
        navigate('/placeorder', { state: { directItems } });
    };

    if (!book) {
        return null;
    }
    // --- KẾT THÚC PHẦN LOGIC ---

    // --- BẮT ĐẦU PHẦN JSX ĐÃ REFACTOR ---
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                {/* Phần trên (Top Section) */}
                <div className="popup-top-section">
                    {/* Cột trái: Ảnh */}
                    <div className="popup-left-column">
                        <img
                            src={book.coverImageUrl || defaultBookImage}
                            alt={book.name}
                            className="popup-book-cover"
                        />
                        <div className="popup-stock-badge">
                            <span>Book</span>
                            <p>Còn lại: {book.inStock || 0} sản phẩm</p>
                        </div>
                    </div>

                    {/* Cột phải: Thông tin & Hành động */}
                    <div className="popup-right-column">
                        <h2 className="popup-book-title">{book.name}</h2>
                        <p className="popup-book-subtitle">Cách giao tiếp</p>
                        <p className="popup-book-price">
                            {parseFloat(book.price * (1 - book.discount / 100)).toLocaleString()}₫
                        </p>

                        <div className="popup-quantity-selector">
                            <div className="quantity-control">
                                <button onClick={() => handleSetquantity(buyQuantity - 1)}><Minus size={16} /></button>
                                <input type="text" value={buyQuantity} readOnly />
                                <button onClick={() => handleSetquantity(buyQuantity + 1)}><Plus size={16} /></button>
                            </div>
                            <span className="quantity-stock-info">Còn lại: {book.inStock || 0} sản phẩm</span>
                        </div>

                        <div className="popup-action-buttons">
                            <button className="popup-add-to-cart-btn" onClick={handleAddToCart}>
                                <ShoppingCart size={20} />
                                Thêm vào giỏ hàng
                            </button>
                            <button className="popup-buy-now-btn" onClick={handleBuyNow}>
                                <ShoppingCart size={20} />
                                Mua ngay
                            </button>
                            <button className="popup-review-btn" onClick={() => setShowReviewPopup(true)}>
                                <Star size={20} />
                                Xem đánh giá
                            </button>
                        </div>
                    </div>
                </div>

                {/* Phần dưới (Bottom Section) */}
                <div className="popup-bottom-section">
                    <h3 className="popup-section-title">Thông tin sách</h3>
                    <div className="popup-info-grid">
                        <div className="info-item">
                            <span className="info-key">Tác giả</span>
                            <span className="info-value">{book.authors?.map(a => a.name).join(', ') || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-key">Nhà xuất bản</span>
                            <span className="info-value">{book.publisher || 'Simon & Schuster'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-key">Ngày xuất bản</span>
                            <span className="info-value">{book.publicationDate ? Moment(book.publicationDate).format('DD/MM/YYYY') : '01/11/1936'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-key">Số trang</span>
                            <span className="info-value">{book.pages || '100'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-key">Ngôn ngữ</span>
                            <span className="info-value">{book.language || 'Vietnamese'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-key">Loại bìa</span>
                            <span className="info-value">{book.coverType || 'Paper'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-key">Thể loại</span>
                            <span className="info-value">{book.categoryId?.name || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-key">Kích thước</span>
                            <span className="info-value">{book.dimensions || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
            {showReviewPopup && <ReviewPopup book={book} onClose={() => setShowReviewPopup(false)} />}
        </div>
    );
};

export default BookDetailPopup;
