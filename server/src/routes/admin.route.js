const express = require('express');
const adminController = require('../controller/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

// Dashboard statistics
router.get('/dashboard', adminController.getDashboardStats);

// Revenue statistics
router.get('/revenue', adminController.getRevenueStats);

// Inventory report
router.get('/inventory', adminController.getInventoryReport);

// Best selling products
router.get('/best-selling', adminController.getBestSellingProducts);

// Sales by category
router.get('/sales-by-category', adminController.getSalesByCategory);

// Customer statistics
router.get('/customers', adminController.getCustomerStats);

module.exports = router;
