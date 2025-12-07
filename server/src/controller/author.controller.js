const catchAsync = require('../utils/catchAsync');
const authorService = require('../services/author.service');
const AppError = require('../utils/appError');

const createAuthor = catchAsync(async (req, res) => {
  const newAuthor = await authorService.createAuthor(req.body);
  res.status(201).json({
    status: 'success',
    data: { author: newAuthor },
  });
});

const getAllAuthors = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await authorService.getAllAuthors({ page, limit });
  res.status(200).json({
    status: 'success',
    results: result.authors.length,
    data: {
      authors: result.authors,
      pagination: {
        page: result.page,
        limit: Number(limit),
        total: result.total,
        totalPages: result.totalPages,
      },
    },
  });
});

const getAuthorById = catchAsync(async (req, res, next) => {
  const author = await authorService.getAuthorById(req.params.id);
  if (!author) {
    return next(new AppError('Tác giả không tồn tại', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { author },
  });
});

const updateAuthor = catchAsync(async (req, res, next) => {
  const updatedAuthor = await authorService.updateAuthor(
    req.params.id,
    req.body
  );
  if (!updatedAuthor) {
    return next(new AppError('Tác giả không tồn tại', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { author: updatedAuthor },
  });
});

const deleteAuthor = catchAsync(async (req, res, next) => {
  const deletedAuthor = await authorService.deleteAuthor(req.params.id);
  if (!deletedAuthor) {
    return next(new AppError('Tác giả không tồn tại', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Đã xóa tác giả thành công',
    data: { author: deletedAuthor },
  });
});

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};
