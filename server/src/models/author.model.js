// models/Author.js
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  biography: {
    type: String, // mô tả chi tiết
    default: '',
  },
  nationality: {
    type: String,
    default: '',
  },
  dateOfBirth: {
    type: Date,
  },
  dateOfDeath: {
    type: Date,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  totalBooks: {
    type: Number,
    default: 0,
  },
  followers: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

authorSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Author', authorSchema);
