const express = require('express');
const orderController = require('../controller/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

// Admin only routes
router
  .route('/admin/')
  .get(authMiddleware.restrictTo('admin'), orderController.getAllOrders);
router
  .route('/admin/:id')
  .patch(authMiddleware.restrictTo('admin'), orderController.updateOrderStatus);

module.exports = router;
