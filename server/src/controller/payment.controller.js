const paymentService = require('../services/payment.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// API xác nhận đã thanh toán (Frontend gọi sau khi chuyển khoản hoặc ấn "Mua hàng" với COD)
exports.confirmPayment = catchAsync(async (req, res) => {
  const { orderId, transactionCode } = req.body; // transactionCode: TxHash (ETH) hoặc mã GD (QR)

  const payment = await paymentService.confirmPayment(orderId, transactionCode);

  res.status(200).json({
    status: 'success',
    data: {
      payment,
    },
  });
});

// API lấy trạng thái thanh toán của đơn hàng
exports.getPaymentStatus = catchAsync(async (req, res) => {
  const payment = await paymentService.getPaymentByOrderId(req.params.orderId);

  res.status(200).json({
    status: 'success',
    data: { payment },
  });
});

exports.initSepayPayment = catchAsync(async (req, res) => {
  const { orderId } = req.body;
  const userId = req.user._id;

  if (!orderId) {
    throw new AppError('orderId là bắt buộc', 400);
  }

  const result = await paymentService.initSepayPayment(
    orderId,
    userId,
    req.body.amount
  );

  res.status(200).json({
    status: 'success',
    data: {
      payment: result.payment,
      paymentInfo: result.paymentInfo,
    },
  });
});

exports.handleSepayWebhook = catchAsync(async (req, res) => {
  const webhookData = req.body;

  const result = await paymentService.handleSepayWebhook(webhookData);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

exports.getSepayStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const payment = await paymentService.getPaymentByOrderId(orderId);
  if (!payment) {
    throw new AppError('Không tìm thấy thông tin thanh toán', 404);
  }

  if (payment.user.toString() !== req.user._id.toString()) {
    throw new AppError('Bạn không có quyền truy cập thông tin này', 403);
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment: {
        _id: payment._id,
        order: payment.order,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        transferContent: payment.transferContent,
        sepayTransactionId: payment.sepayTransactionId,
        bankTransferCode: payment.bankTransferCode,
        paymentDate: payment.paymentDate,
        createdAt: payment.createdAt,
      },
    },
  });
});
