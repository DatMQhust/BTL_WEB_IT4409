const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { productId: productId },
    },
    {
      $group: {
        _id: '$productId',
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    const avgRating = stats[0] ? stats[0].avgRating : 0;
    await this.model('Product').findByIdAndUpdate(productId, {
      rating: avgRating,
    });
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.productId);
});

ReviewSchema.post('remove', function () {
  this.constructor.calculateAverageRating(this.productId);
});

module.exports = mongoose.model('Review', ReviewSchema);
