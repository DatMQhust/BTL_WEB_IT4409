const express = require('express');
const cartController = require('../controller/cart.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Apply auth middleware to all routes in this file
router.use(authMiddleware.protect);

router
  .route('/')
  .get(cartController.getCart)
  .post(cartController.addToCart)
  .delete(cartController.clearCart);

router
  .route('/:productId')
  .patch(cartController.updateCartItem)
  .delete(cartController.removeFromCart);

module.exports = router;
