const express = require('express');
const router = express.Router();
const authorController = require('../controller/author.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);

// Admin only routes
router.use(protect, restrictTo('admin'));
router.post('/', authorController.createAuthor);
router.put('/:id', authorController.updateAuthor);
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;
