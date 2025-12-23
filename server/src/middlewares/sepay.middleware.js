const AppError = require('../utils/appError');

exports.verifyWebhook = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError('Thiếu Authorization header', 401);
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Apikey') {
      throw new AppError('Format Authorization header không hợp lệ', 401);
    }

    const apiKey = parts[1];
    const expectedApiKey = process.env.SEPAY_API_KEY;

    if (!expectedApiKey) {
      console.error('SEPAY_API_KEY chưa được cấu hình trong .env');
      throw new AppError('Cấu hình server không hợp lệ', 500);
    }

    if (apiKey !== expectedApiKey) {
      throw new AppError('API Key không hợp lệ', 401);
    }

    console.log('[SePay Webhook] Received at:', new Date().toISOString());
    console.log('[SePay Webhook] IP:', req.ip);

    next();
  } catch (error) {
    next(error);
  }
};
