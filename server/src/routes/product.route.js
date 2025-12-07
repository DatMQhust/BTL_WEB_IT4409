const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin only routes
router.use(protect, restrictTo('admin'));
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
