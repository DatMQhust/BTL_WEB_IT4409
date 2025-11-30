const catchAsync = require('../utils/catchAsync');
const productService = require('../services/product.service');

const getAllProducts = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const products = await productService.getAllProducts({ page, limit });
  res.send(products);
});

const getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send('Sản phẩm không tồn tại');
  }
});

const createProduct = catchAsync(async (req, res) => {
  const {
    name,
    price,
    discount,
    description,
    categoryId,
    authors,
    publisher,
    publicationDate,
    isbn,
    coverImageUrl,
    gallery,
    inStock,
    slug,
  } = req.body;

  const productData = {
    name,
    price,
    discount,
    description,
    categoryId,
    authors,
    publisher,
    publicationDate,
    isbn,
    coverImageUrl,
    gallery,
    inStock,
    slug,
  };

  const newProduct = await productService.createProduct(productData);
  res.status(201).send(newProduct);
});

const updateProduct = catchAsync(async (req, res) => {
  const {
    name,
    price,
    discount,
    description,
    categoryId,
    authors,
    publisher,
    publicationDate,
    isbn,
    coverImageUrl,
    gallery,
    inStock,
    slug,
    sold,
  } = req.body;

  const productData = {
    name,
    price,
    discount,
    description,
    categoryId,
    authors,
    publisher,
    publicationDate,
    isbn,
    coverImageUrl,
    gallery,
    inStock,
    slug,
    sold,
  };

  const updatedProduct = await productService.updateProduct(
    req.params.id,
    productData
  );

  if (updatedProduct) {
    res.send(updatedProduct);
  } else {
    res.status(404).send('Sản phẩm không tồn tại');
  }
});

const deleteProduct = catchAsync(async (req, res) => {
  const deletedProduct = await productService.deleteProduct(req.params.id);
  if (deletedProduct) {
    res.send(deletedProduct);
  } else {
    res.status(404).send('Sản phẩm không tồn tại');
  }
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
