const express = require('express');
const paymentController = require('../controller/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const sepayMiddleware = require('../middlewares/sepay.middleware');

const router = express.Router();

router.post(
  '/sepay/webhook',
  sepayMiddleware.verifyWebhook,
  paymentController.handleSepayWebhook
);

router.use(authMiddleware.protect);

// SePay endpoints
router.post('/sepay/init', paymentController.initSepayPayment);
router.get('/sepay/status/:orderId', paymentController.getSepayStatus);

// Xác nhận thanh toán
router.post('/confirm', paymentController.confirmPayment);

//Kiểm tra đơn hàng
router.get('/:orderId', paymentController.getPaymentStatus);

module.exports = router;
