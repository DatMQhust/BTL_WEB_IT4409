const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const AppError = require('../utils/appError');

const createOrder = async (userId, shippingAddress, paymentMethod) => {
  const user = await User.findById(userId).populate('cart.product');

  if (!user) {
    throw new AppError('Không tìm thấy người dùng.', 404);
  }

  if (user.cart.length === 0) {
    throw new AppError('Giỏ hàng của bạn đang trống.', 400);
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of user.cart) {
    const product = item.product;
    if (product.stock < item.quantity) {
      throw new AppError(`Sản phẩm "${product.name}" không đủ hàng.`, 400);
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
    });
    totalAmount += product.price * item.quantity;
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
  });

  for (const item of user.cart) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  user.cart = [];
  await user.save({ validateBeforeSave: false });

  return order;
};

const getMyOrders = async userId => {
  return await Order.find({ user: userId }).sort('-createdAt');
};

const getOrderById = async (orderId, user) => {
  const order = await Order.findById(orderId).populate('user', 'name email');

  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng.', 404);
  }

  if (order.user._id.toString() !== user.id && user.role !== 'admin') {
    throw new AppError('Bạn không có quyền xem đơn hàng này.', 403);
  }

  return order;
};

const getAllOrders = async () => {
  return await Order.find({}).populate('user', 'id name').sort('-createdAt');
};

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng.', 404);
  }

  order.status = status;
  await order.save();
  return order;
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
