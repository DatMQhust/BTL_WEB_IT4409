const Product = require('../models/product.model');

const getAllProducts = async ({ page, limit }) => {
  const skip = (page - 1) * limit;
  return await Product.find().skip(skip).limit(limit);
};

const getProductById = async id => {
  return await Product.findById(id);
};

const createProduct = async productData => {
  const product = new Product(productData);
  return await product.save();
};

const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, { new: true });
};

const deleteProduct = async id => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
