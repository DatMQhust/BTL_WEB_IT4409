const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Tạo một transporter (sử dụng Mailtrap)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2) Định nghĩa các tùy chọn email
  const mailOptions = {
    from: 'Your App Name <no-reply@yourapp.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: (có thể gửi HTML thay vì text)
  };

  // 3) Thực sự gửi email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;