import React, { useState, useEffect, useRef } from 'react';
import * as sepayService from '../../services/sepay.service';
import './SepayPayment.css';

const SepayPayment = ({ orderId, totalAmount, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [countdown, setCountdown] = useState(15 * 60); // 15 phút
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, completed, expired, error
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  
  const pollingIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Initialize payment khi component mount
  useEffect(() => {
    initPayment();
    return () => {
      // Cleanup intervals khi unmount
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Start countdown timer
  useEffect(() => {
    if (paymentInfo && paymentStatus === 'pending') {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            setPaymentStatus('expired');
            setError('Hết thời gian thanh toán. Vui lòng tạo đơn hàng mới.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }
      };
    }
  }, [paymentInfo, paymentStatus]);

  // Start polling payment status
  useEffect(() => {
    if (paymentInfo && paymentStatus === 'pending') {
      pollingIntervalRef.current = setInterval(() => {
        checkStatus();
      }, 3000); // Check mỗi 3 giây

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [paymentInfo, paymentStatus]);

  const initPayment = async () => {
    try {
      setLoading(true);
      const data = await sepayService.initSepayPayment(orderId, totalAmount);
      setPaymentInfo(data.paymentInfo);
      setLoading(false);
    } catch (err) {
      console.error('Error initializing payment:', err);
      setError(err.response?.data?.message || 'Không thể khởi tạo thanh toán');
      setPaymentStatus('error');
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const payment = await sepayService.checkPaymentStatus(orderId);
      
      if (payment.status === 'Completed') {
        setPaymentStatus('completed');
        
        // Stop polling and countdown
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
        }

        // Delay 1s để show success animation
        setTimeout(() => {
          if (onPaymentSuccess) {
            onPaymentSuccess();
          }
        }, 1500);
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
    }
  };

  const handleCopy = async (text, field) => {
    const success = await sepayService.copyToClipboard(text);
    if (success) {
      setCopied(field);
      setTimeout(() => setCopied(''), 2000);
    }
  };

  if (loading) {
    return (
      <div className="sepay-container">
        <div className="sepay-loading">
          <div className="sepay-spinner"></div>
          <p>Đang khởi tạo thanh toán...</p>
        </div>
      </div>
    );
  }

  if (error && paymentStatus === 'error') {
    return (
      <div className="sepay-container">
        <div className="sepay-error">
          <div className="sepay-error-icon">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'expired') {
    return (
      <div className="sepay-container">
        <div className="sepay-expired">
          <div className="sepay-expired-icon">⏰</div>
          <h3>Hết thời gian thanh toán</h3>
          <p>Đơn hàng đã hết thời gian thanh toán. Vui lòng tạo đơn hàng mới.</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'completed') {
    return (
      <div className="sepay-container">
        <div className="sepay-success">
          <div className="sepay-success-icon">✓</div>
          <h3>Thanh toán thành công!</h3>
          <p>Đơn hàng của bạn đã được xác nhận.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sepay-container">
      <div className="sepay-header">
        <h2 className="sepay-title">Thanh toán SePay</h2>
        <p className="sepay-subtitle">Quét mã QR hoặc chuyển khoản theo thông tin bên dưới</p>
      </div>

      {/* Countdown Timer */}
      <div className="sepay-countdown">
        <span className="sepay-countdown-icon">⏱️</span>
        <span className="sepay-countdown-text">
          Thời gian còn lại: <strong>{sepayService.formatTime(countdown)}</strong>
        </span>
      </div>

      {/* QR Code */}
      <div className="sepay-qr-wrapper">
        <div className="sepay-qr-box">
          <img
            src={paymentInfo.qrCodeUrl}
            alt="Mã QR thanh toán"
            className="sepay-qr-img"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/256x256?text=Lỗi+QR';
            }}
          />
          <div className="sepay-qr-pulse"></div>
        </div>
        <p className="sepay-qr-note">Quét mã QR bằng app ngân hàng</p>
      </div>

      {/* Thông tin chuyển khoản */}
      <div className="sepay-info-box">
        <h3 className="sepay-info-title">Thông tin chuyển khoản:</h3>
        <div className="sepay-info-list">
          
          <div className="sepay-row">
            <span className="sepay-label">Ngân hàng:</span>
            <span className="sepay-value">{paymentInfo.bankName}</span>
          </div>

          <div className="sepay-row">
            <span className="sepay-label">Số tài khoản:</span>
            <div className="sepay-value-group">
              <span className="sepay-value tracking-wider">{paymentInfo.accountNumber}</span>
              <button 
                className="sepay-copy-btn"
                onClick={() => handleCopy(paymentInfo.accountNumber, 'account')}
              >
                {copied === 'account' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          <div className="sepay-row">
            <span className="sepay-label">Chủ tài khoản:</span>
            <span className="sepay-value uppercase">{paymentInfo.accountName}</span>
          </div>

          <div className="sepay-row">
            <span className="sepay-label">Số tiền:</span>
            <div className="sepay-value-group">
              <span className="sepay-value highlight-red">{sepayService.formatCurrency(paymentInfo.amount)}</span>
              <button 
                className="sepay-copy-btn"
                onClick={() => handleCopy(paymentInfo.amount.toString(), 'amount')}
              >
                {copied === 'amount' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          <div className="sepay-row">
            <span className="sepay-label">Nội dung:</span>
            <div className="sepay-value-group">
              <span className="sepay-value highlight-blue">{paymentInfo.transferContent}</span>
              <button 
                className="sepay-copy-btn"
                onClick={() => handleCopy(paymentInfo.transferContent, 'content')}
              >
                {copied === 'content' ? '✓' : '📋'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="sepay-notice">
        <div className="sepay-notice-icon">ℹ️</div>
        <div className="sepay-notice-content">
          <strong>Lưu ý quan trọng:</strong>
          <ul>
            <li>Vui lòng chuyển <strong>đúng số tiền</strong> và <strong>đúng nội dung</strong></li>
            <li>Thanh toán sẽ được xác nhận <strong>tự động</strong> trong vài giây</li>
            <li>Không tắt trang này cho đến khi thanh toán hoàn tất</li>
          </ul>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="sepay-status">
        <div className="sepay-status-spinner"></div>
        <span>Đang chờ thanh toán...</span>
      </div>
    </div>
  );
};

export default SepayPayment;
