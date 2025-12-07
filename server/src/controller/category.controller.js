const catchAsync = require('../utils/catchAsync');
const categoryService = require('../services/category.service');
const AppError = require('../utils/appError');

const createCategory = catchAsync(async (req, res) => {
  const newCategory = await categoryService.createCategory(req.body);
  res.status(201).json({
    status: 'success',
    data: { category: newCategory },
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories },
  });
});

const getCategoryById = catchAsync(async (req, res, next) => {
  const category = await categoryService.getCategoryById(req.params.id);
  if (!category) {
    return next(new AppError('Danh mục không tồn tại', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { category },
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const updatedCategory = await categoryService.updateCategory(
    req.params.id,
    req.body
  );
  if (!updatedCategory) {
    return next(new AppError('Danh mục không tồn tại', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { category: updatedCategory },
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const deletedCategory = await categoryService.deleteCategory(req.params.id);
  if (!deletedCategory) {
    return next(new AppError('Danh mục không tồn tại', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Đã xóa danh mục thành công',
    data: { category: deletedCategory },
  });
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
