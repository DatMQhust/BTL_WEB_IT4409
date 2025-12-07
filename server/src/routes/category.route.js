const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin only routes
router.use(protect, restrictTo('admin'));
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
