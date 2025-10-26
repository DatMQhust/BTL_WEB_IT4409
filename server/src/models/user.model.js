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
            required: [true, 'Vui long nhập email của bạn'],
            unique: true,
            lowercase: true,
            validate: {
                validator: function (el) {
                    return el.includes('@');
            },
                message: 'Email không hợp lệ',
            }, 
        },
        password: {
            type: String,
            required: [true, 'Vui long nhập mật khẩu của bạn'],
            minlength: [8, 'Mật khẩu phải có ít nhất 8 ký tự'],
            select: false, // Tự động ẩn trường này khi query, trừ khi chỉ định
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
userSchema.methods.comparePassword = async function (
    candidatePassword, // Mật khẩu user nhập
    userPassword // Mật khẩu đã hash trong DB
) {
    return await bcrypt.compare(candidatePassword, userPassword);
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