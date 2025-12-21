const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();

// Khởi tạo Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Gửi mã OTP đến số điện thoại
 * @param {string} phone - Số điện thoại (định dạng +84...)
 */
exports.sendOTP = async phone => {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phone,
        channel: 'sms',
      });

    return verification.sid; // Trả về ID của phiên xác thực
  } catch (error) {
    console.error('Lỗi khi gửi OTP Twilio:', error);
    throw new Error(
      'Gửi OTP thất bại. Hãy đảm bảo SĐT hợp lệ và đã xác thực trên Twilio (nếu dùng thử).'
    );
  }
};

/**
 * Kiểm tra mã OTP
 * @param {string} phone - Số điện thoại (định dạng +84...)
 * @param {string} code - Mã OTP người dùng nhập
 */
exports.verifyOTP = async (phone, code) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phone,
        code: code,
      });

    // Twilio trả về status 'approved' nếu mã đúng
    return verificationCheck.status === 'approved';
  } catch (error) {
    console.error('Lỗi khi xác thực OTP Twilio:', error);
    // Trả về false nếu có lỗi (ví dụ: mã sai, đã hết hạn)
    return false;
  }
};
