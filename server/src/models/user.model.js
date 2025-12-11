const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui long nhập tên của bạn'],
    },
    email: {
      type: String,
      required: [true, 'Email là trường bắt buộc.'],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (el) {
          // Cho phép email giả của chúng ta đi qua
          if (el.startsWith('phone-') && el.endsWith('@placeholder.com')) {
            return true;
          }
          return el.includes('@');
        },
        message: 'Email không hợp lệ',
      },
      sparse: true,
    },
    phone: {
      type: String,
      validate: {
        validator: function (el) {
          // Cho phép null/undefined đi qua nếu đăng ký bằng email
          if (!el) return true;
          return el.match(/^\+84\d{9,10}$/);
        },
        message: 'Số điện thoại không hợp lệ. Phải có dạng +84XXXXXXXXX.',
      },
      unique: true,
      sparse: true, // Cho phép phone là null (nếu đăng ký bằng email)
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Vui long nhập mật khẩu của bạn'],
      minlength: [8, 'Mật khẩu phải có ít nhất 8 ký tự'],
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Vui lòng xác nhận mật khẩu'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Mật khẩu xác nhận không khớp',
      },
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);
// // Custom validation: Phải có ít nhất email hoặc phone
// userSchema.pre('validate', function(next) {
//     if (!this.email && !this.phone) {
//         // Nếu không có email và không có phone, tạo lỗi validation
//         this.invalidate('identifier', 'Phải cung cấp ít nhất một Email hoặc Số điện thoại.', 'required');
//     }
//     next();
// });

//Ham băm mật khẩu trước khi lưu vào DB
userSchema.pre('save', async function (next) {
  // Chỉ chạy hàm này nếu password đã bị thay đổi (hoặc mới tạo)
  if (!this.isModified('password')) return next();

  // Hash mật khẩu
  this.password = await bcrypt.hash(this.password, 12);

  // Xóa trường passwordConfirm, không cần lưu nó vào DB
  this.passwordConfirm = undefined;
  next();
});

// So sánh mật khẩu khi đăng nhập
userSchema.methods.comparePassword = async function (candidatePassword) {
  // So sánh mật khẩu người dùng nhập với mật khẩu đã hash của instance này
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance Method: Tạo token reset mật khẩu
userSchema.methods.createPasswordResetToken = function () {
  // 1. Tạo một token ngẫu nhiên
  const resetToken = crypto.randomBytes(32).toString('hex');

  // 2. Hash token này và lưu vào DB (để tăng bảo mật)
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Đặt thời gian hết hạn: 10 phút
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // 4. Trả về token GỐC (chưa hash) để gửi cho user qua email
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
