const catchAsync = require('../utils/catchAsync');
const productService = require('../services/product.service');
const AppError = require('../utils/appError');

const getAllProducts = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    categoryId,
    authorId,
    minPrice,
    maxPrice,
    minRating,
    sort,
    inStock,
  } = req.query;

  const result = await productService.getAllProducts({
    page,
    limit,
    search,
    categoryId,
    authorId,
    minPrice,
    maxPrice,
    minRating,
    sort,
    inStock,
  });

  res.status(200).json({
    status: 'success',
    results: result.products.length,
    data: {
      products: result.products,
      pagination: {
        page: result.page,
        limit: Number(limit),
        total: result.total,
        totalPages: result.totalPages,
      },
    },
  });
});

const getProductById = catchAsync(async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) {
    return next(new AppError('Sản phẩm không tồn tại', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { product },
  });
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
  res.status(201).json({
    status: 'success',
    data: { product: newProduct },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
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

  if (!updatedProduct) {
    return next(new AppError('Sản phẩm không tồn tại', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product: updatedProduct },
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const deletedProduct = await productService.deleteProduct(req.params.id);
  if (!deletedProduct) {
    return next(new AppError('Sản phẩm không tồn tại', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Đã xóa sản phẩm thành công',
    data: { product: deletedProduct },
  });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
