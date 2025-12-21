import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useOrderService } from "../../services/useOrderService";
import "./Checkout.css"; // Import the CSS file

export default function Checkout() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { createOrder, loading, error: orderCreationError } = useOrderService();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.fullName || "",
    address: user?.address || "",
    city: "",
    postalCode: "",
    country: "Việt Nam",
    phone: user?.phone || "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (cart.length === 0 && !loading) {
      navigate("/cart");
    }
  }, [cart, loading, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!user) {
      setFormError("Bạn phải đăng nhập để đặt hàng.");
      return;
    }

    const { fullName, address, city, postalCode, country, phone } = shippingAddress;
    if (!fullName || !address || !city || !postalCode || !country || !phone) {
      setFormError("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }

    try {
      const orderDetails = {
        shippingAddress,
        paymentMethod,
      };
      await createOrder(orderDetails);
      clearCart();
      alert("Đặt hàng thành công!");
      navigate("/my-orders", { state: { orderPlaced: true } });
    } catch (err) {
      setFormError(err.message || "Đã có lỗi xảy ra khi đặt hàng.");
    }
  };

  const totalAmount = cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        <form className="checkout-container" onSubmit={handleSubmit}>
          {/* LEFT COLUMN */}
          <div className="checkout-left">
            {/* Shipping Address Card */}
            <div className="card">
              <h3 className="card-title">Địa chỉ giao hàng</h3>
              {(formError || orderCreationError) && (
                <div className="error-message">
                  {formError || orderCreationError}
                </div>
              )}
              <div className="form-group">
                <label htmlFor="fullName">Họ và tên</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="input-field"
                  value={shippingAddress.fullName}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Địa chỉ</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="input-field"
                  value={shippingAddress.address}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="input-grid">
                <div className="form-group">
                  <label htmlFor="city">Thành phố</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="input-field"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">Mã bưu chính</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    className="input-field"
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="country">Quốc gia</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  className="input-field"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="input-field"
                  value={shippingAddress.phone}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="card">
              <h3 className="card-title">Phương thức thanh toán</h3>
              <div
                className={`payment-method-option ${
                  paymentMethod === "COD" ? "selected" : ""
                }`}
              >
                <label htmlFor="cod">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={handlePaymentMethodChange}
                  />
                  <span className="custom-radio">
                    <span className="dot"></span>
                  </span>
                  <span className="payment-method-label">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                </label>
              </div>
              <div
                className={`payment-method-option ${
                  paymentMethod === "Card" ? "selected" : ""
                }`}
              >
                <label htmlFor="card">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="Card"
                    checked={paymentMethod === "Card"}
                    onChange={handlePaymentMethodChange}
                  />
                   <span className="custom-radio">
                    <span className="dot"></span>
                  </span>
                  <span className="payment-method-label">
                    Thẻ tín dụng/ghi nợ (Card)
                  </span>
                </label>
              </div>
            </div>

             {/* Payment Instructions */}
            <div className="info-box">
                <h3 >1. Phương thức thanh toán</h3>
                <ul>
                    <li>Thanh toán qua QR Code (Chuyển khoản ngân hàng)</li>
                    <li>Thanh toán bằng xu (1 xu = 1,000đ)</li>
                </ul>

                <h3>2. Quy tắc chuyển khoản</h3>
                <ul>
                    <li>Vui lòng chuyển khoản đúng số tiền được hiển thị</li>
                    <li>Ghi nội dung chuyển khoản theo cú pháp: <span style={{fontWeight: 'bold'}}>[Họ và tên] + [Số điện thoại đã đăng ký]</span></li>
                    <li>Ví dụ: <span style={{fontWeight: 'bold'}}>NguyenVanA 0987654321</span></li>
                    <li>Sau khi chuyển khoản xong, nhấn nút "Check Payment"</li>
                    <li>Thời gian xử lý: 30s - 1 phút</li>
                </ul>

                <h3>3. Lưu ý quan trọng</h3>
                <ul>
                    <li>Đơn hàng sẽ tự động hủy sau 24 giờ nếu chưa thanh toán</li>
                    <li>Địa chỉ nhận hàng là địa chỉ bạn đã cài đặt</li>
                    <li>Số điện thoại nhận hàng là số điện thoại bạn đăng ký</li>
                    <li>Nếu chuyển thừa tiền, hệ thống sẽ cộng vào tài khoản xu của bạn</li>
                    <li>Nếu chuyển thiếu tiền hoặc nội dung sai, vui lòng liên hệ hỗ trợ</li>
                </ul>

                <h3>4. Hỗ trợ</h3>
                <ul>
                    <li>Hotline: 0948377358</li>
                    <li>Email: Quy160104@gmail.com</li>
                    <li>Thời gian hỗ trợ: Buổi tối (19h - 23h)</li>
                </ul>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="checkout-right">
            <div className="card sticky-summary">
              <h3 className="card-title">Tóm tắt đơn hàng</h3>
              <div className="summary-item-list">
                {cart.map((item) => (
                  <div key={item._id} className="summary-item">
                    <img src={item.product.coverImageUrl} alt={item.product.name} />
                    <div className="summary-item-info">
                      <p className="summary-item-name">{item.product.name}</p>
                      <p className="summary-item-price">
                        {item.quantity || 0} x {(item.price || 0).toLocaleString()} đ
                      </p>
                    </div>
                    <p className="summary-item-total">
                      {((item.quantity || 0) * (item.price || 0)).toLocaleString()} đ
                    </p>
                  </div>
                ))}
              </div>
              <div className="summary-total-row">
                <span>Tạm tính</span>
                <span>{totalAmount.toLocaleString()} đ</span>
              </div>
              <div className="summary-total-row">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="summary-total-row grand-total">
                <span>Tổng cộng</span>
                <span>{totalAmount.toLocaleString()} đ</span>
              </div>
              <button
                type="submit"
                className="primary-btn"
                disabled={loading || cart.length === 0}
              >
                {loading ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}