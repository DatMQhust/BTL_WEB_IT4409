import React, { useState, useEffect } from 'react';
import reviewService from '../../services/review.service';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { X, Star } from 'lucide-react';
import './ReviewPopup.css';

const ReviewPopup = ({ book, onClose }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');

    const fetchReviews = async () => {
        if (!book?._id) return;
        setLoading(true);
        try {
            const response = await reviewService.getReviewsByProduct(book._id);
            setReviews(response.data.data.reviews || []);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
            toast.error("Không thể tải đánh giá.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [book]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Bạn cần đăng nhập để đánh giá.");
            return;
        }
        if (newRating < 1 || newRating > 5) {
            toast.error("Vui lòng chọn số sao từ 1 đến 5.");
            return;
        }

        try {
            await reviewService.createReview(book._id, newRating, newComment);
            toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
            setNewComment('');
            setNewRating(5);
            fetchReviews(); // Refresh reviews list
        } catch (error) {
            console.error("Failed to submit review", error);
            toast.error(error.response?.data?.message || "Gửi đánh giá thất bại.");
        }
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="review-popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="popup-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>
                <h3>Đánh giá cho sách "{book?.name}"</h3>

                {/* Form to add new review */}
                {user && (
                    <form onSubmit={handleReviewSubmit} className="review-form">
                        <h4>Viết đánh giá của bạn</h4>
                        <div className="rating-input">
                            <span>Điểm:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={24}
                                    className={newRating >= star ? 'filled' : ''}
                                    onClick={() => setNewRating(star)}
                                />
                            ))}
                        </div>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Chia sẻ cảm nhận của bạn..."
                            rows="4"
                        />
                        <button type="submit">Gửi đánh giá</button>
                    </form>
                )}

                {/* List of reviews */}
                <div className="reviews-list">
                    {loading && <p>Đang tải...</p>}
                    {!loading && reviews.length === 0 && <p>Chưa có đánh giá nào cho sản phẩm này.</p>}
                    {!loading && reviews.map(review => (
                        <div key={review._id} className="review-item">
                            <p><strong>{review.userId?.name || 'Vô danh'}</strong></p>
                            <div className="rating-display">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} className="filled" />)}
                                {[...Array(5 - review.rating)].map((_, i) => <Star key={i} size={16} />)}
                            </div>
                            <p>{review.comment}</p>
                            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewPopup;
