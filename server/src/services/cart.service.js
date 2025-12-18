const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const AppError = require('../utils/appError');

// Helper to recalculate totals and save the cart
const _recalculateAndSaveCart = async cart => {
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  await cart.save();
};

/**
 * Get user's cart or create new if not exists.
 * Also, purges items whose products have been deleted.
 */
const getOrCreateCart = async userId => {
  try {
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      await cart.populate({
        path: 'items.product',
        select: 'name price coverImageUrl inStock discount',
      });

      // Filter out items where the product might have been deleted (and is now null)
      const originalItemCount = cart.items.length;
      cart.items = cart.items.filter(item => item.product);

      // If any items were removed, recalculate and save
      if (cart.items.length < originalItemCount) {
        await _recalculateAndSaveCart(cart);
      }
    } else {
      cart = await Cart.create({ user: userId, items: [] });
    }

    return cart;
  } catch (error) {
    console.error('Error in getOrCreateCart:', error);
    throw new AppError('Lỗi khi lấy hoặc tạo giỏ hàng.', 500);
  }
};

/**
 * Add product to cart or update quantity if exists
 */
const addProductToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Không tìm thấy sản phẩm.', 404);
  }
  if (product.inStock < quantity) {
    throw new AppError('Sản phẩm không đủ số lượng trong kho.', 400);
  }

  const cart =
    (await Cart.findOne({ user: userId })) ||
    (await Cart.create({ user: userId, items: [] }));

  const cartItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  const price = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  if (cartItemIndex > -1) {
    const newQuantity = cart.items[cartItemIndex].quantity + quantity;
    if (product.inStock < newQuantity) {
      throw new AppError('Số lượng vượt quá hàng trong kho.', 400);
    }
    cart.items[cartItemIndex].quantity = newQuantity;
    cart.items[cartItemIndex].price = price; // Update price in case it changed
  } else {
    cart.items.push({ product: productId, quantity, price });
  }

  await _recalculateAndSaveCart(cart);

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
    // To remove an item, the specific remove endpoint should be used.
    throw new AppError(
      'Số lượng phải lớn hơn hoặc bằng 1. Để xoá sản phẩm, hãy dùng chức năng xoá.',
      400
    );
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Không tìm thấy sản phẩm.', 404);
  }
  if (product.inStock < quantity) {
    throw new AppError('Sản phẩm không đủ số lượng trong kho.', 400);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Giỏ hàng không tồn tại.', 404);
  }

  const cartItem = cart.items.find(
    item => item.product.toString() === productId
  );

  if (!cartItem) {
    throw new AppError('Sản phẩm không có trong giỏ hàng.', 404);
  }

  cartItem.quantity = quantity;
  cartItem.price = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price; // Update price in case it changed

  await _recalculateAndSaveCart(cart);

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

  await _recalculateAndSaveCart(cart);

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
  let cart = await Cart.findOne({ user: userId });

  if (cart) {
    cart.items = [];
    await _recalculateAndSaveCart(cart);
  } else {
    // If no cart, we can just return an object representing an empty cart
    // as there's nothing to clear.
    cart = { items: [], totalItems: 0, totalPrice: 0 };
  }

  return cart;
};

module.exports = {
  getOrCreateCart,
  addProductToCart,
  updateCartItemQuantity,
  removeProductFromCart,
  clearUserCart,
};
