const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    inStock: {
      type: Number,
      default: 0,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
    },
    author: {
      type: Array,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    publicationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', ProductSchema);
