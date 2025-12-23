const Payment = require('../models/payment.model');
const Order = require('../models/order.model');
const AppError = require('../utils/appError');
const sepayService = require('./sepay.service');

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
    throw new AppError(
      'Không tìm thấy thông tin thanh toán cho đơn hàng này.',
      404
    );
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
    status: 'Processing', // Đơn hàng đã sẵn sàng xử lý
  });

  return payment;
};

const getPaymentByOrderId = async orderId => {
  return await Payment.findOne({ order: orderId });
};

const initSepayPayment = async (orderId, userId, amount) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng', 404);
  }
  if (order.user.toString() !== userId.toString()) {
    throw new AppError('Bạn không có quyền truy cập đơn hàng này', 403);
  }

  const existingPayment = await Payment.findOne({
    order: orderId,
    status: 'Completed',
  });

  if (existingPayment) {
    throw new AppError('Đơn hàng này đã được thanh toán', 400);
  }

  const transferContent = sepayService.generateTransferContent(orderId);

  const payment = await Payment.create({
    order: orderId,
    user: userId,
    amount,
    method: 'SePay',
    status: 'Pending',
    transferContent,
  });

  const paymentInfo = sepayService.generatePaymentInfo(orderId, amount);

  return {
    payment,
    paymentInfo,
  };
};

const handleSepayWebhook = async webhookData => {
  console.log('[SePay Webhook] Processing webhook:', webhookData);

  const validation = sepayService.validateWebhookPayload(webhookData);
  if (!validation.isValid) {
    throw new AppError(
      `Invalid webhook payload: ${validation.errors.join(', ')}`,
      400
    );
  }

  const parsedData = sepayService.parseWebhookPayload(webhookData);

  if (!parsedData.amountIn || parsedData.amountIn <= 0) {
    console.log('[SePay Webhook] Skipping: Not a money-in transaction');
    return { status: 'ignored', reason: 'Not a money-in transaction' };
  }

  const orderId = sepayService.extractOrderIdFromContent(
    parsedData.transferContent
  );

  if (!orderId) {
    console.log(
      '[SePay Webhook] Cannot extract orderId from content:',
      parsedData.transferContent
    );
    return { status: 'ignored', reason: 'Invalid transfer content format' };
  }

  const payment = await Payment.findOne({
    order: orderId,
    method: 'SePay',
    status: 'Pending',
  }).sort('-createdAt');

  if (!payment) {
    console.log('[SePay Webhook] Payment not found for orderId:', orderId);
    return { status: 'ignored', reason: 'Payment not found' };
  }

  const amountDiff = Math.abs(payment.amount - parsedData.amountIn);
  if (amountDiff > 1000) {
    console.log(
      '[SePay Webhook] Amount mismatch. Expected:',
      payment.amount,
      'Got:',
      parsedData.amountIn
    );

    payment.status = 'Failed';
    payment.note = `Số tiền không khớp. Mong đợi: ${payment.amount}, Nhận được: ${parsedData.amountIn}`;
    payment.webhookData = parsedData.rawData;
    await payment.save();

    return { status: 'failed', reason: 'Amount mismatch', payment };
  }

  if (payment.sepayTransactionId === parsedData.sepayTransactionId) {
    console.log('[SePay Webhook] Duplicate webhook, already processed');
    return { status: 'duplicate', payment };
  }

  payment.status = 'Completed';
  payment.sepayTransactionId = parsedData.sepayTransactionId;
  payment.bankTransferCode = parsedData.bankTransferCode;
  payment.transactionCode =
    parsedData.referenceNumber || parsedData.bankTransferCode;
  payment.webhookData = parsedData.rawData;
  payment.paymentDate = new Date(parsedData.transactionDate || Date.now());
  await payment.save();

  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: 'Paid',
    status: 'Processing',
  });

  console.log(
    '[SePay Webhook] Payment completed successfully for orderId:',
    orderId
  );

  return { status: 'success', payment };
};

module.exports = {
  initPayment,
  confirmPayment,
  getPaymentByOrderId,
  initSepayPayment,
  handleSepayWebhook,
};
