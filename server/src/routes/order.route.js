const express = require('express');
const orderController = require('../controller/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

// Admin only routes - PHẢI ĐẶT TRƯỚC các routes động /:id
router
  .route('/admin')
  .get(authMiddleware.restrictTo('admin'), orderController.getAllOrders);
router
  .route('/admin/:id')
  .patch(authMiddleware.restrictTo('admin'), orderController.updateOrderStatus);

// User routes
router.post('/', orderController.createOrder);
router.patch('/:id/pay', orderController.confirmPayment);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

module.exports = router;
