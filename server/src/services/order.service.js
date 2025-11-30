const Order = require('../models/order.model');
const Product = require('../models/product.model');
const AppError = require('../utils/appError');

/**
 * Tạo đơn hàng mới
 * @param {Object} orderData - Dữ liệu đơn hàng từ Controller
 */
const createOrder = async (orderData) => {
  const {
    user,
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingPrice = 0, // Mặc định phí ship là 0
  } = orderData;

  if (orderItems && orderItems.length === 0) {
    throw new AppError('Không có sản phẩm nào trong giỏ hàng', 400);
  }

  //  Lấy thông tin mới nhất của sản phẩm từ DB và tính toán lại giá
  let calculatedItemsPrice = 0;
  const processedItems = [];

  for (const item of orderItems) {
    const productFromDb = await Product.findById(item.product);
    if (!productFromDb) {
      throw new AppError(`Sản phẩm với ID ${item.product} không tồn tại`, 404);
    }

    // Kiểm tra tồn kho
    if (productFromDb.inStock < item.qty) {
      throw new AppError(`Sản phẩm ${productFromDb.name} đã hết hàng hoặc không đủ số lượng.`, 400);
    }

    // Tính giá
    const price = productFromDb.price * (1 - productFromDb.discount / 100); 
    
    calculatedItemsPrice += price * item.qty;

    processedItems.push({
      product: productFromDb._id,
      name: productFromDb.name,
      //image: productFromDb.coverImageUrl || productFromDb.image, // Đảm bảo trường ảnh đúng với Product Model
      price: price,
      qty: item.qty,
    });
    
  }

  const totalPrice = calculatedItemsPrice + shippingPrice;

  const order = new Order({
    user,
    orderItems: processedItems,
    shippingAddress,
    paymentMethod,
    itemsPrice: calculatedItemsPrice,
    shippingPrice,
    totalPrice,
    isPaid: paymentMethod === 'COD' ? false : true, // Giả sử logic thanh toán online sẽ xử lý sau
    paidAt: paymentMethod === 'COD' ? null : Date.now(),
  });

  const createdOrder = await order.save();
  return createdOrder;
};


// Lấy danh sách đơn hàng của user hiện tại
const getMyOrders = async (userId) => {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  return orders;
};

// Lấy chi tiết một đơn hàng theo ID
const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId).populate('user', 'name email');
  if (!order) {
    throw new AppError('Không tìm thấy đơn hàng', 404);
  }
  return order;
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};