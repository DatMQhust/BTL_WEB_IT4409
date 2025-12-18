const Payment = require('../models/payment.model');
const Order = require('../models/order.model');
const AppError = require('../utils/appError');

const initPayment = async (orderId, userId, amount, method) => {
  const payment = await Payment.create({
    order: orderId,
    user: userId,
    amount,
    method,
    status: 'Pending',
  });
  return payment;
};

// Xác nhận thanh toán (Xử lý COD, VietQR, ETH)
const confirmPayment = async (orderId, transactionCode) => {
  // Tìm payment gần nhất của Order này
  const payment = await Payment.findOne({ order: orderId }).sort('-createdAt');

  if (!payment) {
    throw new AppError('Không tìm thấy thông tin thanh toán cho đơn hàng này.', 404);
  }

  // Update trạng thái Payment
  payment.status = 'Completed';
  payment.transactionCode = transactionCode;
  payment.paymentDate = Date.now();
  await payment.save();

  // Nếu là COD -> Đã xác nhận. Nếu là Online -> Đã trả tiền.
  // 3. Update Order Status
  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: 'Paid',
    status: 'Processing' // Đơn hàng đã sẵn sàng xử lý
  });

  return payment;
};

const getPaymentByOrderId = async (orderId) => {
    return await Payment.findOne({ order: orderId });
};

module.exports = {
  initPayment,
  confirmPayment,
  getPaymentByOrderId
};