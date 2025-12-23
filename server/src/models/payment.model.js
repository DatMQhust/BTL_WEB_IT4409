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
      enum: ['COD', 'VietQR', 'ETH', 'SePay'],
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
    // SePay specific fields
    sepayTransactionId: {
      type: String, // ID giao dịch từ SePay
      default: null,
    },
    bankTransferCode: {
      type: String, // Mã giao dịch ngân hàng (reference_number)
      default: null,
    },
    transferContent: {
      type: String, // Nội dung chuyển khoản
      default: null,
    },
    webhookData: {
      type: Object, // Lưu raw webhook data để debug
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
