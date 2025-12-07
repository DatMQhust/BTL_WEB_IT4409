const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Product = require('../models/product.model');
const User = require('../models/user.model');

// Helper function to populate cart items
const populateCart = user => {
  return user.populate({
    path: 'cart.product',
    select: 'name price coverImageUrl inStock',
  });
};

exports.getCart = catchAsync(async (req, res, next) => {
  const user = await populateCart(req.user);

  res.status(200).json({
    status: 'success',
    data: {
      cart: user.cart,
    },
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return next(new AppError('Vui lòng cung cấp ID sản phẩm.', 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Không tìm thấy sản phẩm.', 404));
  }

  if (product.inStock < quantity) {
    return next(new AppError('Sản phẩm không đủ số lượng trong kho.', 400));
  }

  const user = req.user;
  const cartItemIndex = user.cart.findIndex(
    item => item.product.toString() === productId
  );

  if (cartItemIndex > -1) {
    // Product exists in cart, update quantity
    user.cart[cartItemIndex].quantity += quantity;
  } else {
    // Product does not exist in cart, add new item
    user.cart.push({ product: productId, quantity });
  }

  await user.save({ validateBeforeSave: false });

  const populatedUser = await populateCart(user);

  res.status(200).json({
    status: 'success',
    message: 'Sản phẩm đã được thêm vào giỏ hàng.',
    data: {
      cart: populatedUser.cart,
    },
  });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return next(new AppError('Số lượng phải lớn hơn hoặc bằng 1.', 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Không tìm thấy sản phẩm.', 404));
  }
  if (product.inStock < quantity) {
    return next(new AppError('Sản phẩm không đủ số lượng trong kho.', 400));
  }

  const user = req.user;
  const cartItem = user.cart.find(
    item => item.product.toString() === productId
  );

  if (!cartItem) {
    return next(new AppError('Sản phẩm không có trong giỏ hàng.', 404));
  }

  cartItem.quantity = quantity;
  await user.save({ validateBeforeSave: false });

  const populatedUser = await populateCart(user);

  res.status(200).json({
    status: 'success',
    message: 'Giỏ hàng đã được cập nhật.',
    data: {
      cart: populatedUser.cart,
    },
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const user = req.user;

  const initialCartLength = user.cart.length;
  user.cart = user.cart.filter(item => item.product.toString() !== productId);

  if (user.cart.length === initialCartLength) {
    return next(new AppError('Sản phẩm không có trong giỏ hàng.', 404));
  }

  await user.save({ validateBeforeSave: false });

  const populatedUser = await populateCart(user);

  res.status(200).json({
    status: 'success',
    message: 'Sản phẩm đã được xóa khỏi giỏ hàng.',
    data: {
      cart: populatedUser.cart,
    },
  });
});
