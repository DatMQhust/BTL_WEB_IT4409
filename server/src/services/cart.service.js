const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const AppError = require('../utils/appError');

/**
 * Get user's cart or create new if not exists
 */
const getOrCreateCart = async userId => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'name price coverImageUrl inStock discount',
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

/**
 * Add product to cart or update quantity if exists
 */
const addProductToCart = async (userId, productId, quantity = 1) => {
  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Không tìm thấy sản phẩm.', 404);
  }

  if (product.inStock < quantity) {
    throw new AppError('Sản phẩm không đủ số lượng trong kho.', 400);
  }

  // Get or create cart
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Check if product already exists in cart
  const cartItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  // Calculate price with discount
  const price = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  if (cartItemIndex > -1) {
    // Product exists, update quantity and price
    const newQuantity = cart.items[cartItemIndex].quantity + quantity;

    // Check stock for new total quantity
    if (product.inStock < newQuantity) {
      throw new AppError('Số lượng vượt quá hàng trong kho.', 400);
    }

    cart.items[cartItemIndex].quantity = newQuantity;
    cart.items[cartItemIndex].price = price;
  } else {
    // Product does not exist, add new item
    cart.items.push({ product: productId, quantity, price });
  }

  await cart.save();

  // Populate product details before returning
  await cart.populate({
    path: 'items.product',
    select: 'name price coverImageUrl inStock discount',
  });

  return cart;
};

/**
 * Update quantity of a product in cart
 */
const updateCartItemQuantity = async (userId, productId, quantity) => {
  if (quantity < 1) {
    throw new AppError('Số lượng phải lớn hơn hoặc bằng 1.', 400);
  }

  // Validate product and stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Không tìm thấy sản phẩm.', 404);
  }

  if (product.inStock < quantity) {
    throw new AppError('Sản phẩm không đủ số lượng trong kho.', 400);
  }

  // Get cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Giỏ hàng không tồn tại.', 404);
  }

  // Find cart item
  const cartItem = cart.items.find(
    item => item.product.toString() === productId
  );

  if (!cartItem) {
    throw new AppError('Sản phẩm không có trong giỏ hàng.', 404);
  }

  // Update quantity and price
  cartItem.quantity = quantity;
  cartItem.price = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  await cart.save();

  // Populate product details before returning
  await cart.populate({
    path: 'items.product',
    select: 'name price coverImageUrl inStock discount',
  });

  return cart;
};

/**
 * Remove product from cart
 */
const removeProductFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Giỏ hàng không tồn tại.', 404);
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(item => item.product.toString() !== productId);

  if (cart.items.length === initialLength) {
    throw new AppError('Sản phẩm không có trong giỏ hàng.', 404);
  }

  await cart.save();

  // Populate product details before returning
  await cart.populate({
    path: 'items.product',
    select: 'name price coverImageUrl inStock discount',
  });

  return cart;
};

/**
 * Clear all items from cart
 */
const clearUserCart = async userId => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError('Giỏ hàng không tồn tại.', 404);
  }

  cart.items = [];
  await cart.save();

  return cart;
};

module.exports = {
  getOrCreateCart,
  addProductToCart,
  updateCartItemQuantity,
  removeProductFromCart,
  clearUserCart,
};
