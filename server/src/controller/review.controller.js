const catchAsync = require('../utils/catchAsync');
const reviewService = require('../services/review.service');
const AppError = require('../utils/appError');

const createReview = catchAsync(async (req, res) => {
  const newReview = await reviewService.createReview(req.body, req.user.id);
  res.status(201).json({
    status: 'success',
    data: { review: newReview },
  });
});

const getReviewsByProduct = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await reviewService.getReviewsByProduct(req.params.productId, {
    page,
    limit,
  });
  res.status(200).json({
    status: 'success',
    results: result.reviews.length,
    data: {
      reviews: result.reviews,
      pagination: {
        page: result.page,
        limit: Number(limit),
        total: result.total,
        totalPages: result.totalPages,
      },
    },
  });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const deletedReview = await reviewService.deleteReview(
    req.params.id,
    req.user.id,
    req.user.role
  );
  if (!deletedReview) {
    return next(new AppError('Review không tồn tại', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Đã xóa review thành công',
    data: { review: deletedReview },
  });
});

module.exports = {
  createReview,
  getReviewsByProduct,
  deleteReview,
};
