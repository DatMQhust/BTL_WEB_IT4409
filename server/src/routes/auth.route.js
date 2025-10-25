const express = require('express');
const authController = require('../controller/auth.controller.js');
// còn tiếp

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

module.exports = router;