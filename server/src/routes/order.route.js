const express = require('express');
const orderController = require('../controller/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Tất cả các route sau dòng này đều cần phải xác thực
router.use(authMiddleware.protect);

// Routes cho người dùng thông thường
router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

// Routes chỉ dành cho Admin
// Giả sử bạn đã có middleware restrictTo('admin') như đã tư vấn
// Nếu chưa có, bạn cần tạo nó trong auth.middleware.js
router.use(authMiddleware.restrictTo('admin'));

router.route('/')
    .get(orderController.getAllOrders);

router.route('/:id')
    .patch(orderController.updateOrderStatus);

module.exports = router;
