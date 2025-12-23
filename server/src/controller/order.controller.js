const orderService = require('../services/order.service');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res) => {
  const { shippingAddress, paymentMethod, directItems } = req.body;
  const order = await orderService.createOrder(
    req.user.id,
    shippingAddress,
    paymentMethod,
    directItems
  );

  res.status(201).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.getMyOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user.id);

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user);

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.getAllOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getAllOrders();

  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.updateOrderStatus = catchAsync(async (req, res) => {
  const { status, paymentStatus } = req.body;
  const order = await orderService.updateOrderStatus(
    req.params.id,
    status,
    paymentStatus
  );

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.confirmPayment = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    req.params.id,
    'Completed', // Status
    'Paid'       // Payment Status
  );

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});
