import api from './api';

/**
 * Service để xử lý các API calls liên quan đến SePay
 */

/**
 * Khởi tạo thanh toán SePay
 * @param {string} orderId - ID đơn hàng
 * @param {number} amount - Số tiền
 * @returns {Promise} - Payment info
 */
export const initSepayPayment = async (orderId, amount) => {
  try {
    const response = await api.post('/payments/sepay/init', {
      orderId,
      amount,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error initializing SePay payment:', error);
    throw error;
  }
};

/**
 * Kiểm tra trạng thái thanh toán
 * @param {string} orderId - ID đơn hàng
 * @returns {Promise} - Payment status
 */
export const checkPaymentStatus = async (orderId) => {
  try {
    const response = await api.get(`/payments/sepay/status/${orderId}`);
    return response.data.data.payment;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

/**
 * Format số tiền VND
 * @param {number} amount - Số tiền
 * @returns {string} - Formatted amount
 */
export const formatCurrency = (amount) => {
  return amount?.toLocaleString('vi-VN') + ' ₫';
};

/**
 * Format thời gian countdown
 * @param {number} seconds - Số giây
 * @returns {string} - Formatted time (MM:SS)
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback cho browsers cũ
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};
