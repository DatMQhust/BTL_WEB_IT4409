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
  // Regex để tìm giá trị bị trùng lặp trong chuỗi lỗi
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Giá trị trùng lặp: ${value}. Vui lòng sử dụng giá trị khác!`;
  return new AppError(message, 400); // Trả về lỗi 400 (Bad Request)
};

const handleCastErrorDB = err => {
    const message = `Dữ liệu không hợp lệ tại ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

// --- MIDDLEWARE XỬ LÝ LỖI TOÀN CỤC ---
app.use((req, res, next) => { // Xử lý 404
  next(new AppError(`Không tìm thấy đường dẫn ${req.originalUrl} trên server này!`, 404));
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
    // Chỉ hiển thị stack/error chi tiết ở môi trường dev
    // error: process.env.NODE_ENV === 'development' ? error : undefined, 
    // stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, 
  });
});

module.exports = app;
