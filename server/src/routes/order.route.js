const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');
const { protect } = require('../middlewares/auth.middleware');

// Middleware
router.use(protect);

router.route('/').post(orderController.createOrder);
router.route('/myorders').get(orderController.getMyOrders);
router.route('/:id').get(orderController.getOrderById);

module.exports = router;