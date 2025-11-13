const catchAsync = require('../utils/catchAsync');
const categoryService = require('../services/category.service');

const createCategory = catchAsync(async (req, res) => {
  const newCategory = await categoryService.createCategory(req.body);
  res.status(201).send(newCategory);
});

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.send(categories);
});

const getCategoryById = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  if (category) {
    res.send(category);
  } else {
    res.status(404).send('Danh mục không tồn tại');
  }
});

const updateCategory = catchAsync(async (req, res) => {
  const updatedCategory = await categoryService.updateCategory(
    req.params.id,
    req.body
  );
  if (updatedCategory) {
    res.send(updatedCategory);
  } else {
    res.status(404).send('Danh mục không tồn tại');
  }
});

const deleteCategory = catchAsync(async (req, res) => {
  const deletedCategory = await categoryService.deleteCategory(req.params.id);
  if (deletedCategory) {
    res.send(deletedCategory);
  } else {
    res.status(404).send('Danh mục không tồn tại');
  }
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
