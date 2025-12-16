const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Lấy token và kiểm tra nó có tồn tại không
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập.', 401)
    );
  }

  // 2) Xác thực token
  let decoded;
  try {
    // promisify biến jwt.verify (vốn dùng callback) thành một hàm async/await
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError('Token không hợp lệ hoặc đã hết hạn.', 401));
  }

  // 3) Kiểm tra user sở hữu token này có còn tồn tại không
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('Người dùng sở hữu token này không còn tồn tại.', 401)
    );
  }

  // (Tùy chọn: Kiểm tra nếu user đổi mật khẩu sau khi token được cấp)
  // ...

  // 4) Gắn thông tin user vào request để các controller sau có thể sử dụng
  req.user = currentUser;
  next();
});

// Middleware: Restrict access to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles = ['admin', 'lead-guide']. req.user.role = 'user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Bạn không có quyền thực hiện hành động này.', 403)
      );
    }
    next();
  };
};