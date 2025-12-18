const express = require('express');
const paymentController = require('../controller/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

// Xác nhận thanh toán
router.post('/confirm', paymentController.confirmPayment);

//Kiểm tra đơn hàng 
router.get('/:orderId', paymentController.getPaymentStatus);

module.exports = router;