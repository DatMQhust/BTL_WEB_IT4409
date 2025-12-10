const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const cartService = require('../services/cart.service');

exports.getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getOrCreateCart(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return next(new AppError('Vui lòng cung cấp ID sản phẩm.', 400));
  }

  const cart = await cartService.addProductToCart(
    req.user.id,
    productId,
    quantity
  );

  res.status(200).json({
    status: 'success',
    message: 'Sản phẩm đã được thêm vào giỏ hàng.',
    data: {
      cart,
    },
  });
});

exports.updateCartItem = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await cartService.updateCartItemQuantity(
    req.user.id,
    productId,
    quantity
  );

  res.status(200).json({
    status: 'success',
    message: 'Giỏ hàng đã được cập nhật.',
    data: {
      cart,
    },
  });
});

exports.removeFromCart = catchAsync(async (req, res) => {
  const { productId } = req.params;

  const cart = await cartService.removeProductFromCart(req.user.id, productId);

  res.status(200).json({
    status: 'success',
    message: 'Sản phẩm đã được xóa khỏi giỏ hàng.',
    data: {
      cart,
    },
  });
});

exports.clearCart = catchAsync(async (req, res) => {
  const cart = await cartService.clearUserCart(req.user.id);

  res.status(200).json({
    status: 'success',
    message: 'Giỏ hàng đã được xóa.',
    data: {
      cart,
    },
  });
});
