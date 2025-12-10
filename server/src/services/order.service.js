const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const AppError = require('../utils/appError');

const createOrder = async (userId, shippingAddress, paymentMethod) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('Không tìm thấy người dùng.', 404);
  }

  const cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    throw new AppError('Giỏ hàng của bạn đang trống.', 400);
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = item.product;
    if (product.inStock < item.quantity) {
      throw new AppError(`Sản phẩm "${product.name}" không đủ hàng.`, 400);
    }
    orderItems.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price: item.price,
    });
    totalAmount += item.price * item.quantity;
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { inStock: -item.quantity, sold: item.quantity },
    });
  }

  cart.items = [];
  await cart.save();

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
