const express = require('express');
const router = express.Router();
const reviewController = require('../controller/review.controller');

router.post('/', reviewController.createReview);
router.get('/product/:productId', reviewController.getReviewsByProduct);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
