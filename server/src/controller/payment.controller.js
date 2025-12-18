const paymentService = require('../services/payment.service');
const catchAsync = require('../utils/catchAsync');

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
        data: { payment }
    });
}); 