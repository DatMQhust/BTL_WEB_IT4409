const express = require('express');
const router = express.Router();
const reviewController = require('../controller/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/product/:productId', reviewController.getReviewsByProduct);

// Authenticated routes
router.use(authMiddleware.protect);
router.post('/', reviewController.createReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
