const express = require('express');
const orderController = require('../controller/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

router.route('/admin/').get(orderController.getAllOrders);

router.route('/admin/:id').patch(orderController.updateOrderStatus);

module.exports = router;
