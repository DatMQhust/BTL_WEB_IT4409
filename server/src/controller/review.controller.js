const catchAsync = require('../utils/catchAsync');
const reviewService = require('../services/review.service');

const createReview = catchAsync(async (req, res) => {
  const newReview = await reviewService.createReview(req.body, req.user.id);
  res.status(201).send(newReview);
});

const getReviewsByProduct = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const reviews = await reviewService.getReviewsByProduct(
    req.params.productId,
    { page, limit }
  );
  res.send(reviews);
});

const deleteReview = catchAsync(async (req, res) => {
  const deletedReview = await reviewService.deleteReview(
    req.params.id,
    req.user.id,
    req.user.role
  );
  if (deletedReview) {
    res.send(deletedReview);
  } else {
    res.status(404).send('Review không tồn tại');
  }
});

module.exports = {
  createReview,
  getReviewsByProduct,
  deleteReview,
};
