const catchAsync = require('../utils/catchAsync');
const orderService = require('../services/order.service');

// POST /api/orders
const createOrder = catchAsync(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingPrice,
  } = req.body;

  const order = await orderService.createOrder({
    user: req.user._id, // Lấy id từ middleware auth
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingPrice,
  });

  res.status(201).json(order);
});

// GET /api/orders/myorders
const getMyOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user._id);
  res.json(orders);
});

// GET /api/orders/:id
const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  // Kiểm tra quyền: Chỉ người tạo đơn hoặc Admin mới xem được
  if (order.user._id.toString() !== req.user._id.toString() /* && !req.user.isAdmin */) {
     // throw new AppError('Bạn không có quyền xem đơn hàng này', 403);
     // Tạm thời để mở hoặc thêm logic check admin sau
  }
  res.json(order);
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};