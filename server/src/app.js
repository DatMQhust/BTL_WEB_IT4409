const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes/index.js');
const AppError = require('./utils/appError');

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors({}));
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', routes);

// Code xử lý các lỗi 404 not found
const handleDuplicateFieldsDB = err => {
  const key = Object.keys(err.keyValue)[0];
  const value = err.keyValue[key];
  if (value === null) {
    return new AppError(
      `Một tài khoản khác (đăng ký bằng SĐT) đã tồn tại.`,
      400
    );
  }
  const message = `Trường [${key}] với giá trị [${value}] đã tồn tại. Vui lòng sử dụng giá trị khác!`;
  return new AppError(message, 400); // Trả về lỗi 400 (Bad Request)
};

const handleCastErrorDB = err => {
  const message = `Dữ liệu không hợp lệ tại ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

app.use((req, res, next) => {
  // Xử lý 404
  next(
    new AppError(
      `Không tìm thấy đường dẫn ${req.originalUrl} trên server này!`,
      404
    )
  );
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err, name: err.name, message: err.message };

  // 1. Lỗi trùng lặp (Duplicate Field)
  if (error.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  }

  // 2. Lỗi dữ liệu không đúng định dạng (ví dụ: ID không hợp lệ)
  if (error.name === 'CastError') {
    error = handleCastErrorDB(error);
  }

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
});

module.exports = app;
