const Review = require('../models/review.model');

const createReview = async (reviewData, userId) => {
  const { productId, rating, comment } = reviewData;

  const review = await Review.create({
    productId,
    rating,
    comment,
    userId,
  });
  return review;
};

const getReviewsByProduct = async (productId, { page, limit }) => {
  const skip = (page - 1) * limit;
  return await Review.find({ productId: productId })
    .populate('userId', 'name avatar')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
};

const deleteReview = async (reviewId, userId, userRole) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    return null;
  }

  if (review.userId.toString() !== userId && userRole !== 'admin') {
    throw new Error('Không có quyền xóa review này');
  }

  await review.remove();
  return review;
};

module.exports = {
  createReview,
  getReviewsByProduct,
  deleteReview,
};
