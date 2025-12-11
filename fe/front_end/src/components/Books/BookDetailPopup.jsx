import React, { useState, useEffect, useCallback } from "react";
import { Minus, Plus, Pen, ShoppingCart, Star, X } from "lucide-react";
import { Dialog } from "@headlessui/react";
import axios from 'axios';
import Cookies from "js-cookie";
import Moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./BookDetailPopup.css"; // Import file CSS mới

const BookDetailPopup = ({ book, onClose }) => {
    const [listComment, setListComment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [rating, setRating] = useState(0);
    const [buyQuantity, setBuyQuantity] = useState(1);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const MAX_DESCRIPTION_LENGTH = 350;
    const apiUrl = import.meta.env.VITE_API_URL;

    const getAllReview = useCallback(async (bookId) => {
        setLoading(true);
        axios.get(`${apiUrl}/api/reviews/product/${bookId}`)
            .then((response) => {
                setListComment(response.data.data.reviews || response.data);
            })
            .catch(err => {
                console.error("Lỗi khi lấy đánh giá:", err);
                setListComment([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [apiUrl]);

    useEffect(() => {
        if (book?._id) {
            getAllReview(book._id);
        }
    }, [book, getAllReview]);

    const getRatingArray = () => {
        const arr = [0, 0, 0, 0, 0, 0];
        listComment.forEach(c => {
            if (c.rating >= 1 && c.rating <= 5) arr[c.rating]++;
        });
        return arr;
    };

    const caculatePercentStar = (score) => {
        const total = listComment.length || 1;
        return (getRatingArray()[score] / total) * 100;
    };

    const caculateAverageRating = () => {
        if (listComment.length === 0) return 0;
        const sum = listComment.reduce((acc, c) => acc + c.rating, 0);
        return (sum / listComment.length);
    };

    const postReview = async (rating, comment, bookId) => {
        const authToken = Cookies.get('authToken');
        if (!authToken) {
            toast.error("Vui lòng đăng nhập để gửi đánh giá.");
            return;
        }
        await axios.post(`${apiUrl}/api/reviews`, { rating, comment, productId: bookId }, {
            headers: { 'Authorization': `Bearer ${authToken}` },
        });
    };

    const handleSetquantity = (value) => {
        if (value < 1) return;
        if (book && value > book.inStock) {
            toast.warn(`Chỉ còn ${book.inStock} sản phẩm trong kho.`);
            return;
        }
        setBuyQuantity(value);
    };

    const handleSubmitReview = async () => {
        await postReview(rating, comment, book._id);
        await getAllReview(book._id);
        setIsOpenDialog(false);
        setRating(0);
        setComment("");
    };

    const addToCart = async () => {
        const authToken = Cookies.get('authToken');
        if (!authToken) {
            toast.error("Vui lòng đăng nhập để thêm sách vào giỏ hàng");
            return;
        }
        try {
            await axios.post(`${apiUrl}/api/cart`, {
                productId: book._id,
                quantity: buyQuantity
            }, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            toast.success("Đã thêm vào giỏ hàng!");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Thêm vào giỏ hàng thất bại.";
            toast.error(errorMessage);
        }
    };
    
    if (!book) {
        return null;
    }

    return (
        <div className="book-detail-popup-overlay" onClick={onClose}>
            <div className="book-detail-popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}><X size={24} /></button>
                <div className="container">
                    <div className="book-detail-card">
                        <div className="image-section">
                            <img
                                src={(book.images && book.images[0]) || 'default-image.png'}
                                alt={book.name}
                                className="book-cover-image"
                                onClick={() => setIsFullScreen(true)}
                            />
                        </div>
                        <div className="info-section">
                            <h1 className="book-title">{book.name}</h1>
                            <p className="book-author">Tác giả: <strong>{book.authors?.map(a => a.name).join(', ') || 'N/A'}</strong></p>
                            <div className="rating-summary">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} size={32} className={`star-icon ${star <= caculateAverageRating() ? 'filled' : ''}`} />
                                ))}
                                <span className="rating-text">{caculateAverageRating().toFixed(1)} / 5</span>
                            </div>
                            <div className="price-summary">
                                <span className="price-discounted">{parseFloat(book.price * (1 - book.discount / 100)).toLocaleString()}₫</span>
                                {book.discount > 0 && <span className="price-original">{parseFloat(book.price).toLocaleString()}₫</span>}
                                {book.discount > 0 && <span className="discount-badge">-{book.discount}%</span>}
                            </div>
                            <div className="actions-group">
                                <div className="quantity-selector">
                                    <button onClick={() => handleSetquantity(buyQuantity - 1)}><Minus size={16} /></button>
                                    <span>{buyQuantity}</span>
                                    <button onClick={() => handleSetquantity(buyQuantity + 1)}><Plus size={16} /></button>
                                </div>
                                <button className="add-to-cart-btn" onClick={addToCart}>
                                    <ShoppingCart /> Thêm vào giỏ hàng
                                </button>
                            </div>
                            <div className="specs-grid">
                                <div><strong>Danh mục:</strong> {book.categoryId?.name || 'N/A'}</div>
                                <div><strong>Trong kho:</strong> {book.inStock}</div>
                            </div>
                            <div className="description-section">
                                <h2 className="section-title">Mô tả sách</h2>
                                <p className="description-text">
                                    {book.description && book.description.length > MAX_DESCRIPTION_LENGTH && !showFullDescription
                                        ? (<>{book.description.slice(0, MAX_DESCRIPTION_LENGTH)}... <button className="toggle-description-btn" onClick={() => setShowFullDescription(true)}>Xem thêm</button></>)
                                        : (<>{book.description} {book.description && book.description.length > MAX_DESCRIPTION_LENGTH && (<button className="toggle-description-btn" onClick={() => setShowFullDescription(false)}>Ẩn bớt</button>)}</>)
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="reviews-card">
                        <div className="reviews-summary">
                            <div className="summary-left">
                                <div className="average-rating-number">{caculateAverageRating().toFixed(1)}</div>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={22} className={`star-icon ${star <= caculateAverageRating() ? 'filled' : ''}`} />)}
                                </div>
                                <div className="total-reviews-text">({listComment.length} đánh giá)</div>
                            </div>
                            <div className="summary-middle">
                                {[5, 4, 3, 2, 1].map(star => (
                                    <div key={star} className="rating-bar-row">
                                        <span>{star} sao</span>
                                        <div className="rating-bar-background"><div className="rating-bar-foreground" style={{ width: `${caculatePercentStar(star)}%` }}></div></div>
                                        <span>{caculatePercentStar(star).toFixed(0)}%</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-right">
                                <button className="write-review-btn" onClick={() => { !Cookies.get('authToken') ? toast.error("Vui lòng đăng nhập để thêm đánh giá") : setIsOpenDialog(true); }}>
                                    <Pen size={16} /> Viết đánh giá
                                </button>
                            </div>
                        </div>
                        {loading ? <div className="loading-spinner">Đang tải đánh giá...</div> : 
                        <div className="comments-list">
                            {listComment.length === 0 && <div className="no-comments-text">Chưa có đánh giá nào.</div>}
                            {listComment.map((comment, idx) => (
                                <div key={idx} className="comment-item">
                                    <div className="comment-header">
                                        <span className="comment-user">{comment.userId?.name || 'Anonymous'}</span>
                                        <span className="comment-date">{Moment(comment.created_at).format('YYYY-MM-D, HH:mm')}</span>
                                    </div>
                                    <div className="comment-rating">{Array.from({ length: comment.rating }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                                    <p className="comment-text">{comment.comment}</p>
                                </div>
                            ))}
                        </div>
                        }
                    </div>
                </div>
                <Dialog open={isOpenDialog} onClose={() => setIsOpenDialog(false)} className="review-dialog">
                    <div className="dialog-overlay" />
                    <div className="dialog-container">
                        <Dialog.Panel className="dialog-panel">
                            <Dialog.Title className="dialog-title">Đánh giá của bạn</Dialog.Title>
                            <div className="dialog-star-rating">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <Star key={num} onMouseEnter={() => setHoverRating(num)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(num)} className={`dialog-star ${(hoverRating || rating) >= num ? "active" : ""}`} />
                                ))}
                            </div>
                            <textarea rows={4} className="dialog-textarea" placeholder="Viết nhận xét của bạn..." value={comment} onChange={(e) => setComment(e.target.value)} />
                            <div className="dialog-actions">
                                <button onClick={() => setIsOpenDialog(false)} className="dialog-cancel-btn">Hủy</button>
                                <button onClick={handleSubmitReview} className="dialog-submit-btn">Gửi đánh giá</button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
                {isFullScreen && (
                    <div className="fullscreen-image-overlay" onClick={() => setIsFullScreen(false)}>
                        <img src={(book.images && book.images[0]) || 'default-image.png'} alt={book.name} className="fullscreen-image" onClick={e => e.stopPropagation()} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetailPopup;
