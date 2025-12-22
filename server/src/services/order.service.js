const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const AppError = require('../utils/appError');
const paymentService = require('./payment.service');

const createOrder = async (
  userId,
  shippingAddress,
  paymentMethod,
  directItems = null
) => {
  console.log('--- Creating Order for a User ---');
  console.log('User ID:', userId);

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('Không tìm thấy người dùng.', 404);
  }

  const orderItems = [];
  let totalAmount = 0;

  // LOGIC MỚI: Nếu có directItems (Mua ngay) thì xử lý luôn, bỏ qua Cart
  if (directItems && directItems.length > 0) {
    for (const item of directItems) {
      // Cần query lại Product để lấy giá chính xác, tránh Client gửi giá ảo
      const product = await Product.findById(item.product);
      if (!product) throw new AppError(`Sản phẩm không tồn tại`, 400);
      if (product.inStock < item.quantity) {
        throw new AppError(`Sản phẩm "${product.name}" không đủ hàng.`, 400);
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price, // Lấy giá từ DB, không tin tưởng Client
      });
      totalAmount += product.price * item.quantity;
    }
  }
  // LOGIC CŨ: Nếu không có directItems, lấy từ Cart
  else {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      throw new AppError('Giỏ hàng của bạn đang trống.', 400);
    }
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
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
    //paymentStatus: 'Pending'
  });
  console.log('Order created successfully with ID:', order._id);

  // Khởi tạo Payment record
  await paymentService.initPayment(
    order._id,
    userId,
    totalAmount,
    paymentMethod
  );

  for (const item of orderItems) {
    const updateResult = await Product.findOneAndUpdate(
      {
        _id: item.product,
        inStock: { $gte: item.quantity },
      },
      {
        $inc: { inStock: -item.quantity, sold: item.quantity },
      },
      { new: true }
    );

    if (!updateResult) {
      await Order.findByIdAndDelete(order._id);
      throw new AppError(
        `Sản phẩm "${item.name}" đã hết hàng trong lúc xử lý đơn hàng.`,
        400
      );
    }
  }

  if (!directItems) {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
  }

  return order;
};

const getMyOrders = async userId => {
  console.log('--- Fetching Orders for a User ---');
  console.log('Querying orders for User ID:', userId);
  const orders = await Order.find({ user: userId }).sort('-createdAt');
  console.log(`Found ${orders.length} orders for this user.`);
  return orders;
};

const getOrderById = async (orderId, user) => {
  const order = await Order.findById(orderId)
    .populate('user', 'name email')
    // Populate product so FE can render correct product image link
    .populate('items.product', 'name coverImageUrl');

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

const updateOrderStatus = async (orderId, status, paymentStatus) => {
  const updateData = {};
  if (status) updateData.status = status;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;

  const order = await Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
    runValidators: false,
  }).populate('user', 'name email');

  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng.', 404);
  }

  return order;
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
