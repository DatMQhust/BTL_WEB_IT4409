const Category = require('../models/category.model');
const Product = require('../models/product.model');

const createCategory = async categoryData => {
  if (!categoryData.slug) {
    categoryData.slug = categoryData.name.toLowerCase().replace(/\s+/g, '-');
  }
  return await Category.create(categoryData);
};

const getAllCategories = async () => {
  return await Category.find().populate('parentCategory', 'name slug');
};

const getCategoryById = async id => {
  return await Category.findById(id).populate('parentCategory', 'name slug');
};

const updateCategory = async (id, updateData) => {
  if (updateData.name && !updateData.slug) {
    updateData.slug = updateData.name.toLowerCase().replace(/\s+/g, '-');
  }
  return await Category.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteCategory = async id => {
  const productCount = await Product.countDocuments({ categoryId: id });
  if (productCount > 0) {
    throw new Error('Không thể xóa danh mục vì vẫn còn sản phẩm');
  }

  const subCategoryCount = await Category.countDocuments({
    parentCategory: id,
  });
  if (subCategoryCount > 0) {
    throw new Error('Không thể xóa danh mục vì vẫn còn danh mục con');
  }

  return await Category.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
