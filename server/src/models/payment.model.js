const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
      required: [true, 'Payment must belong to an Order'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Payment must belong to a User'],
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ['COD', 'VietQR', 'ETH'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    transactionCode: {
      type: String, // Lưu mã giao dịch ngân hàng hoặc TxHash của Blockchain
      default: null,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    note: String, 
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;