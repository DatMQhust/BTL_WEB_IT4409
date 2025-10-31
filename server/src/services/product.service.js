const Product = require('../models/product.model');
const Author = require('../models/author.model');
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

const createProduct = async productData => {
  const { authors } = productData;
  const trimmedNames = authors.map(a => a.trim());

  const existingAuthors = await Author.find({ name: { $in: trimmedNames } });
  const existingAuthorMap = new Map(existingAuthors.map(a => [a.name, a]));

  const newAuthors = [];
  const authorIds = [];

  for (const name of trimmedNames) {
    const existing = existingAuthorMap.get(name);
    if (existing) {
      authorIds.push(existing._id);
    } else {
      newAuthors.push({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        totalBooks: 1,
      });
    }
  }

  let createdAuthors = [];
  if (newAuthors.length > 0) {
    createdAuthors = await Author.insertMany(newAuthors);
  }

  authorIds.push(...createdAuthors.map(a => a._id));

  if (existingAuthors.length > 0) {
    await Author.bulkWrite(
      existingAuthors.map(a => ({
        updateOne: {
          filter: { _id: a._id },
          update: { $inc: { totalBooks: 1 } },
        },
      }))
    );
  }

  productData.authors = authorIds;
  const product = await Product.create(productData);

  await Author.bulkWrite(
    authorIds.map(id => ({
      updateOne: {
        filter: { _id: id },
        update: { $push: { books: product._id } },
      },
    }))
  );

  return product;
};

const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, {
    new: true,
  })
    .populate('authors', 'name slug')
    .populate('categoryId', 'name slug');
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
