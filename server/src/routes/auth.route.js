const express = require('express');
const authController = require('../controller/auth.controller.js');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

//không có tiền để đăng ký bản full sđt đâu.
router.post('/verify-phone', authController.verifyPhone); //chỉ có số +84394658369 là dùng được, nhưng phải xóa (drop) index cũ trên MongoDB

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// Admin only routes
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));
router.get('/all', authController.getAllUsers);
router.delete('/:id', authController.deleteUser);

module.exports = router;
