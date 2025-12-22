const Product = require('../models/product.model');
const Author = require('../models/author.model');
const Category = require('../models/category.model');
const categoryService = require('./category.service');

const getAllProducts = async ({
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
}) => {
  const skip = (page - 1) * limit;

  // Build query filter
  const filter = {};

  // Search by name, description, ISBN
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { isbn: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by category
  if (categoryId) {
    filter.categoryId = categoryId;
  }

  // Filter by author
  if (authorId) {
    filter.authors = authorId;
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Filter by rating
  if (minRating) {
    filter.rating = { $gte: Number(minRating) };
  }

  // Filter by stock availability
  if (inStock === 'true') {
    filter.inStock = { $gt: 0 };
  }

  // Build sort
  let sortOption = { createdAt: -1 }; // default: newest first
  if (sort) {
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'bestseller':
        sortOption = { sold: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
  }

  const products = await Product.find(filter)
    .populate('authors', 'name slug')
    .populate('categoryId', 'name slug')
    .skip(skip)
    .limit(Number(limit))
    .sort(sortOption);

  const total = await Product.countDocuments(filter);

  return {
    products,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

const getProductById = async id => {
  return await Product.findById(id)
    .populate('authors', 'name slug')
    .populate('categoryId', 'name slug');
};

const handleAuthorLogic = async (authors = []) => {
  if (authors.length === 0) {
    return [];
  }
  const authorNames = authors.map(a => a.name.trim());
  const existingAuthors = await Author.find({ name: { $in: authorNames } });
  const existingAuthorMap = new Map(existingAuthors.map(a => [a.name, a]));

  const newAuthorsToCreate = [];
  const authorIds = [];

  for (const name of authorNames) {
    const existing = existingAuthorMap.get(name);
    if (existing) {
      authorIds.push(existing._id);
    } else {
      newAuthorsToCreate.push({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        totalBooks: 0,
      });
    }
  }
  let createdAuthors = [];
  if (newAuthorsToCreate.length > 0) {
    createdAuthors = await Author.insertMany(newAuthorsToCreate);
  }
  authorIds.push(...createdAuthors.map(a => a._id));
  return authorIds;
};

const createProduct = async productData => {
  const { authors, categoryId, name } = productData;
  if (name && !productData.slug) {
    productData.slug = name.toLowerCase().replace(/\s+/g, '-');
  }
  const authorIds = await handleAuthorLogic(authors);

  productData.authors = authorIds;
  const product = await Product.create(productData);

  if (authorIds.length > 0) {
    await Author.bulkWrite(
      authorIds.map(id => ({
        updateOne: {
          filter: { _id: id },
          update: {
            $push: { books: product._id },
            $inc: { totalBooks: 1 },
          },
        },
      }))
    );
  }

  if (categoryId) {
    await categoryService.addProductToCategory(categoryId, product._id);
  }

  return product;
};

const updateProduct = async (id, productData) => {
  const product = await Product.findById(id);
  if (!product) {
    return { updatedProduct: null, categories: [] };
  }

  const oldAuthorIds = product.authors.map(a => a.toString());
  const oldCategoryId = product.categoryId;

  let newAuthorIds = oldAuthorIds;
  if (productData.authors) {
    newAuthorIds = (await handleAuthorLogic(productData.authors)).map(a =>
      a.toString()
    );
    productData.authors = newAuthorIds;
  }

  const authorsToRemove = oldAuthorIds.filter(
    oldId => !newAuthorIds.includes(oldId)
  );
  const authorsToAdd = newAuthorIds.filter(
    newId => !oldAuthorIds.includes(newId)
  );

  const operations = [];

  if (authorsToRemove.length > 0) {
    operations.push(
      ...authorsToRemove.map(authorId => ({
        updateOne: {
          filter: { _id: authorId },
          update: { $pull: { books: id }, $inc: { totalBooks: -1 } },
        },
      }))
    );
  }

  if (authorsToAdd.length > 0) {
    operations.push(
      ...authorsToAdd.map(authorId => ({
        updateOne: {
          filter: { _id: authorId },
          update: { $push: { books: id }, $inc: { totalBooks: 1 } },
        },
      }))
    );
  }

  if (operations.length > 0) {
    await Author.bulkWrite(operations);
  }

  if (productData.categoryId && productData.categoryId !== oldCategoryId) {
    await categoryService.removeProductFromCategory(oldCategoryId, id);
    await categoryService.addProductToCategory(productData.categoryId, id);
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
    new: true,
  })
    .populate('authors', 'name slug')
    .populate('categoryId', 'name slug');

  // Get all categories for the frontend dropdown
  const categories = await Category.find().select('_id name slug').sort('name');

  return { updatedProduct, categories };
};

const deleteProduct = async id => {
  const product = await Product.findById(id);
  if (!product) {
    return null;
  }

  const authorIds = product.authors;
  const categoryId = product.categoryId;

  if (authorIds && authorIds.length > 0) {
    await Author.updateMany(
      { _id: { $in: authorIds } },
      { $pull: { books: id }, $inc: { totalBooks: -1 } }
    );
  }

  if (categoryId) {
    await categoryService.removeProductFromCategory(categoryId, id);
  }

  await Product.findByIdAndDelete(id);
  return product;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
