import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
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
          <p className="text-gray-500 dark:text-gray-400 mb-8">Bạn cần đăng nhập để xem giỏ hàng và mua sắm.</p>
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
          <p className="text-gray-500 dark:text-gray-400 mb-8">Hãy bắt đầu khám phá và thêm những cuốn sách bạn yêu thích!</p>
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
      <div className="cart-container">
        <h1 className="cart-header">Giỏ Hàng</h1>
        <p className="cart-summary-text">
          Bạn đang có {cartItemCount} sản phẩm trong giỏ hàng.
        </p>

        <div className="cart-grid">
          {/* Cart Items */}
          <div className="cart-items-container">
            {cart.map((item) => (
              <div key={item.product._id} className="cart-item-card">
                <img src={item.product.coverImageUrl} alt={item.product.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                  <p className="cart-item-price">{item.product.price.toLocaleString('vi-VN')}₫</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="quantity-control">
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                        className="quantity-btn rounded-l-full"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)} className="quantity-btn rounded-r-full">
                        +
                      </button>
                    </div>
                    <button className="text-red-500 hover:underline" onClick={() => removeFromCart(item.product._id)}>
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary-card">
            <h2 className="summary-title">Tóm tắt đơn hàng</h2>
            <div className="summary-row">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển</span>
              <span>{shippingCost > 0 ? `${shippingCost.toLocaleString('vi-VN')}₫` : "Miễn phí"}</span>
            </div>
            <div className="summary-total">
              <span>Tổng cộng</span>
              <span>{total.toLocaleString('vi-VN')}₫</span>
            </div>
            <button onClick={() => navigate('/placeorder')} className="action-btn checkout-btn mt-6">
              Tiến hành thanh toán
            </button>
            <button onClick={clearCart} className="action-btn clear-cart-btn">
              Xóa tất cả giỏ hàng
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}