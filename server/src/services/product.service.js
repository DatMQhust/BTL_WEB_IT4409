const Product = require('../models/product.model');
const Author = require('../models/author.model');
const categoryService = require('./category.service');

const getAllProducts = async ({ page, limit }) => {
  const skip = (page - 1) * limit;
  return await Product.find()
    .populate('authors', 'name slug')
    .populate('categoryId', 'name slug')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
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
    return null;
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

  return updatedProduct;
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
