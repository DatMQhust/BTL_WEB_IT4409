import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowLeft } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import LoginPopup from "../../components/LoginPopup/LoginPopup";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Cart.css"; // Import the CSS file

export default function Cart() {
  const { user } = useAuth();
  const { cart, loading, updateCartQuantity, removeFromCart, clearCart, cartItemCount } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  // Example shipping cost, you can make this dynamic
  const shippingCost = subtotal > 500000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shippingCost;

  // Unauthenticated user view
  if (!user) {
    return (
      <>
        <Navbar setShowLogin={setShowLogin} />
        {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
        <div className="empty-cart-container">
          <h2 className="empty-cart-text">Vui lòng đăng nhập</h2>
          <p className="empty-cart-subtext">Bạn cần đăng nhập để xem giỏ hàng và mua sắm.</p>
          <button onClick={() => setShowLogin(true)} className="empty-cart-link">
            Đăng nhập ngay
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar setShowLogin={setShowLogin} />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-xl font-semibold">Đang tải giỏ hàng của bạn...</div>
        </div>
        <Footer />
      </>
    );
  }

  // Empty cart view
  if (cart.length === 0) {
    return (
      <>
        <Navbar setShowLogin={setShowLogin} />
        <div className="empty-cart-container">
          <h2 className="empty-cart-text">Giỏ hàng của bạn đang trống</h2>
          <p className="empty-cart-subtext">Hãy bắt đầu khám phá và thêm những cuốn sách bạn yêu thích!</p>
          <Link to="/" className="empty-cart-link">
            Khám phá sách
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // Main cart view
  return (
    <>
      <Navbar setShowLogin={setShowLogin} />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="cart-page">
        <div className="cart-container">
          {/* Left Column: Cart Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.product._id} className="cart-item-card">
                <input type="checkbox" className="item-checkbox" defaultChecked />
                <div className="item-image">
                  <img src={item.product.coverImageUrl || '/default-book.png'} alt={item.product.name} />
                </div>
                <div className="item-details">
                  <p className="item-name">{item.product.name}</p>
                  <p className="item-price">{item.price.toLocaleString('vi-VN')}₫</p>
                </div>
                <div className="item-quantity-controls">
                  <div className="quantity-adjuster">
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)}>+</button>
                  </div>
                  <button className="item-remove-btn" onClick={() => removeFromCart(item.product._id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="item-total-price">
                  <p>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <div className="order-summary-card">
            <h3 className="summary-title">Tóm tắt đơn hàng</h3>
            <div className="summary-row">
              <span>Số lượng sản phẩm</span>
              <span>{cartItemCount}</span>
            </div>
            <div className="summary-row">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển</span>
              <span>{shippingCost > 0 ? `${shippingCost.toLocaleString('vi-VN')}₫` : "Miễn phí"}</span>
            </div>
            <div className="summary-total">
              <div className="summary-row">
                <span>Tổng cộng</span>
                <span className="total-amount">{total.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
            <button onClick={() => navigate('/placeorder')} className="checkout-button">
              Thanh toán
            </button>
            <Link to="/" className="continue-shopping-link">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}