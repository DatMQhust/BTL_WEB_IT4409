// models/Product.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number, // %
      default: 0,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    inStock: {
      type: Number,
      default: 0,
    },
    authors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Author',
      },
    ],
    publisher: {
      type: String,
      trim: true,
    },
    publicationDate: {
      type: Date,
    },
    isbn: {
      type: String,
      trim: true,
    },
    coverImageUrl: {
      type: String,
      trim: true,
    },
    gallery: [
      {
        type: String,
        trim: true,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', ProductSchema);
