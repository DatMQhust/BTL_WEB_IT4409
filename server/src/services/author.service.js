const Author = require('../models/author.model');
const Product = require('../models/product.model');

const createAuthor = async authorData => {
  if (!authorData.slug) {
    authorData.slug = authorData.name.toLowerCase().replace(/\s+/g, '-');
  }
  return await Author.create(authorData);
};

const getAllAuthors = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const authors = await Author.find()
    .skip(skip)
    .limit(Number(limit))
    .sort({ name: 1 });
  const total = await Author.countDocuments();

  return {
    authors,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

const getAuthorById = async id => {
  return await Author.findById(id).populate('books', 'name slug coverImageUrl');
};

const updateAuthor = async (id, updateData) => {
  if (updateData.name && !updateData.slug) {
    updateData.slug = updateData.name.toLowerCase().replace(/\s+/g, '-');
  }
  return await Author.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteAuthor = async id => {
  const author = await Author.findById(id);
  if (!author) {
    return null;
  }

  await Product.updateMany(
    { _id: { $in: author.books } },
    { $pull: { authors: author._id } }
  );

  return await Author.findByIdAndDelete(id);
};

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};
