import api from './api';

const reviewService = {
  getReviewsByProduct: (productId, page = 1, limit = 10) => {
    return api.get(`/reviews/product/${productId}`, {
      params: { page, limit },
    });
  },

  createReview: (productId, rating, comment) => {
    return api.post('/reviews', {
      productId,
      rating,
      comment,
    });
  },
};

export default reviewService;
