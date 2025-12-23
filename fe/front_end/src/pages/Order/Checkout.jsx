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

      // Capture the created order, assuming the service returns it
      const response = await createOrder(orderDetails);
      const newOrder = response.data.order;

      clearCart();

      if (paymentMethod === "COD") {
        alert("Đặt hàng thành công!");
        navigate("/my-orders", { state: { orderPlaced: true } });
      } else {
        // Redirect to Payment page with order data
        // If createOrder doesn't return the object, we have to fallback to something else,
        // but assuming standard REST behavior it returns the data.
        navigate("/payment", { state: { orderData: newOrder, paymentMethod } });
      }

    } catch (err) {
      setFormError(err.message || "Đã có lỗi xảy ra khi đặt hàng.");
    }
  };

  const totalAmount = cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);

  return (
    <>
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

              {/* COD */}
              <div
                className={`payment-method-option ${paymentMethod === "COD" ? "selected" : ""
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

              {/* SePay */}
              <div
                className={`payment-method-option ${paymentMethod === "SePay" ? "selected" : ""
                  }`}
              >
                <label htmlFor="sepay">
                  <input
                    type="radio"
                    id="sepay"
                    name="paymentMethod"
                    value="SePay"
                    checked={paymentMethod === "SePay"}
                    onChange={handlePaymentMethodChange}
                  />
                  <span className="custom-radio">
                    <span className="dot"></span>
                  </span>
                  <span className="payment-method-label">
                    Chuyển khoản ngân hàng (SePay - Tự động xác nhận)
                  </span>
                </label>
              </div>

              {/* VietQR */}
              <div
                className={`payment-method-option ${paymentMethod === "VietQR" ? "selected" : ""
                  }`}
              >
                <label htmlFor="vietqr">
                  <input
                    type="radio"
                    id="vietqr"
                    name="paymentMethod"
                    value="VietQR"
                    checked={paymentMethod === "VietQR"}
                    onChange={handlePaymentMethodChange}
                  />
                  <span className="custom-radio">
                    <span className="dot"></span>
                  </span>
                  <span className="payment-method-label">
                    Thanh toán qua chuyển khoản (VietQR)
                  </span>
                </label>
              </div>

              {/* ETH */}
              <div
                className={`payment-method-option ${paymentMethod === "ETH" ? "selected" : ""
                  }`}
              >
                <label htmlFor="eth">
                  <input
                    type="radio"
                    id="eth"
                    name="paymentMethod"
                    value="ETH"
                    checked={paymentMethod === "ETH"}
                    onChange={handlePaymentMethodChange}
                  />
                  <span className="custom-radio">
                    <span className="dot"></span>
                  </span>
                  <span className="payment-method-label">
                    Thanh toán bằng Crypto (ETH)
                  </span>
                </label>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="info-box">
              <h3 >1. Phương thức thanh toán</h3>
              <ul>
                <li>Thanh toán khi nhận hàng (COD)</li>
                <li>Chuyển khoản ngân hàng (SePay - Tự động xác nhận)</li>
                <li>Thanh toán chuyển khoản ngân hàng (VietQR)</li>
                <li>Thanh toán bằng Crypto (ETH)</li>
              </ul>

              <h3>2. Hướng dẫn thanh toán bằng Crypto (ETH)</h3>
              <ul>
                <li>Vui lòng cài đặt ví MetaMask tại đây:
                  <ol><a href="https://chromewebstore.google.com/detail/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=item-share-cb">MetaMask Chrome Extension</a></ol>
                </li>
                <li>Đăng nhập / Đăng ký tài khoản MetaMask</li>
                <li>Mở MetaMask option (3 dấu gạch góc trên bên phải)</li>
                <li>Chọn Mạng → Thêm Mạng tùy chỉnh</li>
                <li>Thêm thông tin mạng như sau:
                  <ol>
                    <li> Tên mạng: Localhost 8545</li>
                    <li> URL: http://127.0.0.1:8545</li>
                    <li> ID chuỗi: 31337</li>
                    <li> Ký hiệu tiền tệ: ETH</li> 
                  </ol>
                </li>
                <li>Truy cập vào mạng Localhost 8545 sau đó:
                  <ol>
                    <li>Import ví MetaMask thử nghiệm (góc trên bên trái)</li>
                    <li>Chọn Thêm ví → Nhập tài khoản → Nhập Private Key</li>
                  </ol>
                </li>
                <li>Danh sách Private Key thử nghiệm:
                  <ol>
                    <li>Private Key 1 (10 000 ETH): 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d</li>
                    <li>Private Key 2 (10 000 ETH): 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a</li>
                    <li>Private Key 3 (10 000 ETH): 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6</li>
                    <li>Private Key 4 (10 000 ETH): 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a</li>
                    <li>Private Key 5 (10 000 ETH): 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba</li>
                  </ol>
                </li>
              </ul>

              <h3>3. Lưu ý quan trọng</h3>
              <ul>
                <li>Đơn hàng sẽ tự động hủy sau 24 giờ nếu chưa thanh toán</li>
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
                {loading
                  ? "Đang xử lý..."
                  : (paymentMethod === "VietQR" || paymentMethod === "ETH" || paymentMethod === "SePay"
                    ? "Đến trang thanh toán"
                    : "Đặt hàng")}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}