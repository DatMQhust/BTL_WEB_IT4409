import React, { useState } from 'react';
import './VietQRPayment.css';


const BANK_CONFIG = {
  BANK_ID: 'MB',
  ACCOUNT_NO: '0365408910',
  ACCOUNT_NAME: 'SAM NGOC DOI',
  TEMPLATE: 'compact'
};

const VietQRPayment = ({ orderId, totalAmount, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);

  // Tạo URL QR Code
  const getQRCodeUrl = () => {
    const { BANK_ID, ACCOUNT_NO, TEMPLATE, ACCOUNT_NAME } = BANK_CONFIG;
    const addInfo = `Order${orderId}`;
    return `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${totalAmount}&addInfo=${addInfo}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;
  };

  // Format tiền tệ
  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN') + ' ₫';
  };

  // Xử lý xác nhận thanh toán
  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      // Giả lập gọi API (delay 1.5s)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Có lỗi xảy ra khi xác nhận thanh toán");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vietqr-container">
      <div className="vietqr-header">
        <h2 className="vietqr-title">Thanh toán VietQR</h2>
        <p className="vietqr-subtitle">Quét mã QR bên dưới để thanh toán</p>
      </div>

      {/* QR Code Image */}
      <div className="vietqr-image-wrapper">
        <div className="vietqr-image-box">
          <img
            src={getQRCodeUrl()}
            alt="Mã QR thanh toán"
            className="vietqr-img"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/256x256?text=Lỗi+QR';
            }}
          />
        </div>
      </div>

      {/* Thông tin chuyển khoản */}
      <div className="vietqr-info-box">
        <h3 className="vietqr-info-title">Thông tin chuyển khoản:</h3>
        <div className="vietqr-info-list">
          <div className="vietqr-row">
            <span className="vietqr-label">Ngân hàng:</span>
            <span className="vietqr-value">{BANK_CONFIG.BANK_ID}</span>
          </div>
          <div className="vietqr-row">
            <span className="vietqr-label">Số tài khoản:</span>
            <span className="vietqr-value tracking-wider">{BANK_CONFIG.ACCOUNT_NO}</span>
          </div>
          <div className="vietqr-row">
            <span className="vietqr-label">Chủ tài khoản:</span>
            <span className="vietqr-value uppercase">{BANK_CONFIG.ACCOUNT_NAME}</span>
          </div>
          <div className="vietqr-row">
            <span className="vietqr-label">Số tiền:</span>
            <span className="vietqr-value highlight-red">{formatPrice(totalAmount)}</span>
          </div>
          <div className="vietqr-row">
            <span className="vietqr-label">Nội dung:</span>
            <span className="vietqr-value highlight-blue">Order{orderId}</span>
          </div>
        </div>
      </div>

      {/* Nút xác nhận */}
      <button
        onClick={handleConfirmPayment}
        disabled={loading}
        className={`vietqr-button ${loading ? 'loading' : ''}`}
      >
        {loading ? (
          <span className="vietqr-loading-content">
            <span className="vietqr-spinner"></span>
            Đang xử lý...
          </span>
        ) : (
          '✅ Tôi đã chuyển khoản'
        )}
      </button>
    </div>
  );
};

export default VietQRPayment;