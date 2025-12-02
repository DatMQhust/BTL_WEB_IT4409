import React, { useState, useEffect } from "react";
import { Minus, Plus, Pen, ShoppingCart, Star } from "lucide-react";
import { Dialog } from "@headlessui/react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import Cookies from 'js.cookie';
import Moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./ProductDetail.css"; // Import file CSS mới

const ProductDetail = () => {
    // --- TOÀN BỘ LOGIC CỦA BẠN ĐƯỢC GIỮ NGUYÊN ---
    const userId = Cookies.get('userId');
    const [listComment, setListComment] = useState([]);
    const [productDetail, setProductDetail] = useState();
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [rating, setRating] = useState(0);
    const [buyQuantity, setBuyQuantity] = useState(1);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const MAX_DESCRIPTION_LENGTH = 350;
    const apiUrl = import.meta.env.VITE_API_URL;
    let { id } = useParams();

    useEffect(() => {
        getProductDetail();
        getAllReview(id);
    }, [id]);

    const getProductDetail = () => {
        axios.get(`${apiUrl}/product/${id}`) // API: Lấy chi tiết sản phẩm
            .then((response) => {
                setProductDetail(response.data);
            });
    };

    const getAllReview = async (productId) => {
        axios.get(`${apiUrl}/reviews/product/${productId}`) // API: Lấy review theo sản phẩm
            .then((response) => {
                setListComment(response.data);
            });
    };

    const getRatingArray = () => {
        const arr = [0, 0, 0, 0, 0, 0];
        listComment.forEach(c => {
            if (c.rating >= 1 && c.rating <= 5) arr[c.rating]++;
        });
        return arr;
    };

    const caculatePercentStar = (score) => {
        const arr = getRatingArray();
        const total = listComment.length || 1;
        return (arr[score] / total) * 100;
    };

    const caculateAverageRating = () => {
        if (listComment.length === 0) return 0;
        const sum = listComment.reduce((acc, c) => acc + c.rating, 0);
        return sum / listComment.length;
    };

    const postReview = async (rating, comment, productId) => {
        const data = { "rating": rating, "comment": comment };
        await axios.post(`${apiUrl}/reviews`, { ...data, productId: productId }, { // API: Gửi review mới
            headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` },
        });
    };

    const handleSetquantity = (value) => {
        if (value < 1) return;
        setBuyQuantity(value);
    };

    const handleSubmitReview = async () => {
        await postReview(rating, comment, id);
        await getAllReview(id);
        setIsOpenDialog(false);
        setRating(0);
        setComment("");
    };

    const addToCart = async () => {
        try {
            await axios.post(`${apiUrl}/cart`, { // API: Thêm vào giỏ hàng
                userId: Number(userId),
                productId: Number(id),
                quantity: buyQuantity
            }, {
                headers: { 'Authorization': `Bearer ${Cookies.get('authToken')}` }
            });
            toast.success("Đã thêm vào giỏ hàng!");
        } catch (error) {
            const errorMessage = !Cookies.get('authToken')
                ? "Vui lòng đăng nhập để thêm sách vào giỏ hàng"
                : "Sách này đã có trong giỏ hàng của bạn";
            toast.error(errorMessage);
        }
    };

    if (!productDetail) {
        return <div className="loading-screen">Loading...</div>;
    }

    // --- GIAO DIỆN ĐÃ ĐƯỢC VIẾT LẠI BẰNG HTML/CSS CƠ BẢN ---

    return (
        <div className="book-detail-page">
            <div className="container">
                <div className="product-detail-card">
                    {/* Ảnh sách */}
                    <div className="image-section">
                        <img
                            src={(productDetail.images && productDetail.images[0]) || 'default-image.png'}
                            alt={productDetail.name}
                            className="product-cover-image"
                            onClick={() => setIsFullScreen(true)}
                        />
                    </div>

                    {/* Thông tin sách */}
                    <div className="info-section">
                        <h1 className="product-title">{productDetail.name}</h1>
                        <p className="product-author">Tác giả: <strong>{productDetail.authors?.map(a => a.name).join(', ') || 'N/A'}</strong></p>

                        <div className="rating-summary">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} size={32} className={`star-icon ${star <= caculateAverageRating() ? 'filled' : ''}`} />
                            ))}
                            <span className="rating-text">{caculateAverageRating().toFixed(1)} / 5</span>
                        </div>

                        <div className="price-summary">
                            <span className="price-discounted">{parseFloat(productDetail.price * (1 - productDetail.discount / 100)).toLocaleString()}₫</span>
                            {productDetail.discount > 0 && <span className="price-original">{parseFloat(productDetail.price).toLocaleString()}₫</span>}
                            {productDetail.discount > 0 && <span className="discount-badge">-{productDetail.discount}%</span>}
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
                            <div><strong>Danh mục:</strong> {productDetail.categoryId?.name || 'N/A'}</div>
                            <div><strong>Trong kho:</strong> {productDetail.inStock}</div>
                            {/* Các trường khác bạn có thể thêm vào nếu API trả về */}
                        </div>

                        <div className="description-section">
                            <h2 className="section-title">Mô tả sách</h2>
                            <p className="description-text">
                                {productDetail.description && productDetail.description.length > MAX_DESCRIPTION_LENGTH && !showFullDescription
                                    ? (
                                        <>
                                            {productDetail.description.slice(0, MAX_DESCRIPTION_LENGTH)}...
                                            <button className="toggle-description-btn" onClick={() => setShowFullDescription(true)}>Xem thêm</button>
                                        </>
                                    ) : (
                                        <>
                                            {productDetail.description}
                                            {productDetail.description && productDetail.description.length > MAX_DESCRIPTION_LENGTH && (
                                                <button className="toggle-description-btn" onClick={() => setShowFullDescription(false)}>Ẩn bớt</button>
                                            )}
                                        </>
                                    )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Phần đánh giá */}
                <div className="reviews-card">
                    <div className="reviews-summary">
                        <div className="summary-left">
                            <div className="average-rating-number">{caculateAverageRating().toFixed(1)}</div>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} size={22} className={`star-icon ${star <= caculateAverageRating() ? 'filled' : ''}`} />
                                ))}
                            </div>
                            <div className="total-reviews-text">({listComment.length} đánh giá)</div>
                        </div>
                        <div className="summary-middle">
                            {[5, 4, 3, 2, 1].map(star => (
                                <div key={star} className="rating-bar-row">
                                    <span>{star} sao</span>
                                    <div className="rating-bar-background">
                                        <div className="rating-bar-foreground" style={{ width: `${caculatePercentStar(star)}%` }}></div>
                                    </div>
                                    <span>{caculatePercentStar(star).toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-right">
                            <button className="write-review-btn" onClick={() => {
                                if (!Cookies.get('authToken')) {
                                    toast.error("Vui lòng đăng nhập để thêm đánh giá");
                                } else {
                                    setIsOpenDialog(true);
                                }
                            }}>
                                <Pen size={16} /> Viết đánh giá
                            </button>
                        </div>
                    </div>

                    <div className="comments-list">
                        {listComment.length === 0 && <div className="no-comments-text">Chưa có đánh giá nào.</div>}
                        {listComment.map((comment, idx) => (
                            <div key={idx} className="comment-item">
                                <div className="comment-header">
                                    <span className="comment-user">{comment.userId?.name || 'Anonymous'}</span>
                                    <span className="comment-date">{Moment(comment.created_at).format('YYYY-MM-D, HH:mm')}</span>
                                </div>
                                <div className="comment-rating">
                                    {Array.from({ length: comment.rating }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <p className="comment-text">{comment.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dialog viết đánh giá */}
            <Dialog open={isOpenDialog} onClose={() => setIsOpenDialog(false)} className="review-dialog">
                <div className="dialog-overlay" />
                <div className="dialog-container">
                    <Dialog.Panel className="dialog-panel">
                        <Dialog.Title className="dialog-title">Đánh giá của bạn</Dialog.Title>
                        <div className="dialog-star-rating">
                            {[1, 2, 3, 4, 5].map(num => (
                                <Star
                                    key={num}
                                    onMouseEnter={() => setHoverRating(num)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(num)}
                                    className={`dialog-star ${(hoverRating || rating) >= num ? "active" : ""}`}
                                />
                            ))}
                        </div>
                        <textarea
                            rows={4}
                            className="dialog-textarea"
                            placeholder="Viết nhận xét của bạn..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="dialog-actions">
                            <button onClick={() => setIsOpenDialog(false)} className="dialog-cancel-btn">Hủy</button>
                            <button onClick={handleSubmitReview} className="dialog-submit-btn">Gửi đánh giá</button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Modal phóng to ảnh */}
            {isFullScreen && (
                <div className="fullscreen-image-overlay" onClick={() => setIsFullScreen(false)}>
                    <img
                        src={(productDetail.images && productDetail.images[0]) || 'default-image.png'}
                        alt={productDetail.name}
                        className="fullscreen-image"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}

            <ToastContainer theme="light" />
        </div>
    );
};

export default ProductDetail;