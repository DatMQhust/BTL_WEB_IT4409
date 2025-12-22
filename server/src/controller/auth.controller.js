const crypto = require('crypto');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../services/email.service');
const twilioService = require('../services/twilio.service');

const signToken = id => {
  const testJWT_SECRET = 'day_la_mot_gia_tri_bi_mat';
  console.log(
    'JWT_SECRET VALUE:',
    process.env.JWT_SECRET ? 'Defined' : 'UNDEFINED'
  );
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Gửi token qua cookie (bảo mật hơn localStorage)
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() +
        process.env.JWT_EXPIRES_IN.replace('d', '') * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Cookie không thể bị truy cập bởi JavaScript phía client
    secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS ở production
  });

  // Xóa mật khẩu khỏi output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

//-----CONTROLLER ALL FUNCTOIONS-----//
exports.register = catchAsync(async (req, res, next) => {
  let { name, email, phone, password, passwordConfirm } = req.body;

  if (!email && !phone) {
    return next(
      new AppError(
        'Vui lòng cung cấp email hoặc số điện thoại để đăng ký.',
        400
      )
    );
  }

  if (phone && !email) {
    // Tạo một email giả, duy nhất dựa trên SĐT
    const safePhone = phone.replace('+', '');
    // Gán email giả vào biến 'email'
    email = `phone-${safePhone}@placeholder.com`;
  }
  const newUser = await User.create({
    name,
    email: email,
    phone: phone || undefined,
    password,
    passwordConfirm,
  });

  if (phone) {
    // Gửi OTP để xác thực
    await twilioService.sendOTP(phone);

    // Trả về thông báo yêu cầu xác thực
    return res.status(201).json({
      status: 'success',
      message:
        'Đăng ký thành công. Vui lòng kiểm tra điện thoại để nhận mã OTP và xác thực.',
    });
  }
  // Nếu chỉ đăng ký bằng email, tạo token và đăng nhập luôn
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const identifier = req.body.identifier || req.body.email;
  const { password } = req.body;

  if (!identifier || !password) {
    return next(new AppError('Vui lòng cung cấp email và mật khẩu!', 400));
  }
  //Xác định identifier là email hay phone
  const isEmail = identifier.includes('@');
  const query = isEmail ? { email: identifier } : { phone: identifier };

  // tìm user (lấy cả password), do mặc định password không được select
  const user = await User.findOne(query).select('+password');

  // check user
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(
      new AppError('Email, số điện thoại hoặc mật khẩu không chính xác!', 401)
    );
  }
  // Nếu đăng nhập bằng phone VÀ phone chưa được xác thực
  if (!isEmail && !user.isPhoneVerified) {
    // Gửi lại mã OTP
    await twilioService.sendOTP(user.phone);

    return next(
      new AppError(
        'Số điện thoại của bạn chưa được xác thực. Chúng tôi đã gửi lại mã OTP. Vui lòng xác thực tại /api/auth/verify-phone.',
        403 // 403 Forbidden - Cấm truy cập
      )
    );
  }

  // Nếu mọi thứ OK, gửi token cho client
  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Lấy user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // Gửi thông báo thành công chung chung để tránh lộ thông tin
    return res.status(200).json({
      status: 'success',
      message: 'Nếu email tồn tại, bạn sẽ nhận được link reset mật khẩu.',
    });
  }

  // 2) Tạo token reset ngẫu nhiên
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // Lưu lại user với token mới (tắt validate)

  // 3) Gửi token về email của user
  // (QUAN TRỌNG! Frontend dùng token này để tạo link reset mật khẩu)
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/auth/reset-password/${resetToken}`;

  const message = `Bạn quên mật khẩu? Gửi yêu cầu PATCH với mật khẩu mới và passwordConfirm tới: ${resetURL}.\nNếu bạn không yêu cầu, hãy bỏ qua email này!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Yêu cầu reset mật khẩu (có hiệu lực trong 10 phút)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token reset mật khẩu đã được gửi tới email!',
    });
  } catch (err) {
    // Nếu gửi email lỗi, reset lại token trong DB
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.', 500)
    );
  }
});

exports.verifyPhone = catchAsync(async (req, res, next) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return next(
      new AppError('Vui lòng cung cấp số điện thoại và mã OTP.', 400)
    );
  }

  const user = await User.findOne({ phone });

  if (!user) {
    return next(
      new AppError('Số điện thoại này không liên kết với tài khoản nào.', 404)
    );
  }

  // 1. Gọi service Twilio để kiểm tra mã
  const isApproved = await twilioService.verifyOTP(phone, code);

  // 2. Xử lý kết quả
  if (isApproved) {
    // Nếu mã đúng -> Cập nhật trạng thái user
    user.isPhoneVerified = true;
    await user.save({ validateBeforeSave: false }); // Tắt validate vì ta không thay đổi password

    // Đăng nhập cho user và gửi token
    createSendToken(user, 200, res);
  } else {
    // Nếu mã sai
    return next(new AppError('Mã OTP không chính xác hoặc đã hết hạn.', 400));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Lấy user dựa trên token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Token chưa hết hạn
  });

  // 2) Nếu token không hợp lệ hoặc đã hết hạn
  if (!user) {
    return next(new AppError('Token không hợp lệ hoặc đã hết hạn', 400));
  }

  // 3) Đặt lại mật khẩu mới
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined; // Xóa token
  user.passwordResetExpires = undefined; // Xóa thời gian hết hạn

  // Phải .save() để kích hoạt middleware pre-save (hash mk) và validate
  await user.save();

  // 4) Đăng nhập user và gửi JWT
  createSendToken(user, 200, res);
});

// Get all users (Admin only)
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select(
    '-password -passwordResetToken -passwordResetExpires'
  );

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// Delete user (Admin only)
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('Không tìm thấy người dùng với ID này', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
