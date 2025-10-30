const Product = require('../models/product.model');

/**
 * Creates a new product.
 * @param {object} productBody - The product data to be created.
 * @returns {Promise<Product>} The newly created product document.
 */
const createProduct = productBody => Product.create(productBody);

/**
 * Query for products with filters, sorting, and pagination.
 * This function optimizes by running the find and count operations in parallel.
 *
 * @param {object} filter - Mongoose filter object. Example: { title: 'Book Title', genre: 'Fiction' }
 * @param {object} options - Query options.
 * @param {string} [options.sortBy] - Sort option in the format: 'field:(desc|asc)'. Defaults to 'createdAt:desc'.
 * @param {number} [options.limit=10] - Maximum number of results per page (max 100).
 * @param {number} [options.page=1] - Current page (minimum 1).
 * @returns {Promise<Object>} An object containing `results` (array of product documents),
 *                           `page`, `limit`, `totalPages`, and `totalResults`.
 */
const queryProducts = async (filter, options) => {
  // Sanitize and set defaults for pagination, enforcing a max limit.
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  let limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  limit = Math.min(limit, 100); // Enforce a max limit of 100
  const sortBy = options.sortBy || 'createdAt:desc';

  const skip = (page - 1) * limit;

  // Build the sort object from the sortBy string
  const sort = {};
  if (sortBy) {
    const parts = sortBy.split(':'); // e.g., 'price:desc'
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  // Execute find and count operations concurrently for improved performance
  const [results, totalResults] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).lean(), // Use .lean() for faster reads
    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalResults / limit);

  return {
    results,
    page,
    limit,
    totalPages,
    totalResults,
  };
};

/**
 * Get a single product by its ID.
 * @param {string} id - The ID of the product to retrieve.
 * @returns {Promise<Product|null>} The product document, or null if not found.
 */
const getProductById = id => Product.findById(id);

/**
 * Update a product by its ID.
 * @param {string} productId - The ID of the product to update.
 * @param {object} updateBody - The update data.
 * @returns {Promise<Product|null>} The updated product document, or null if not found.
 */
const updateProductById = (productId, updateBody) =>
  Product.findByIdAndUpdate(productId, updateBody, { new: true });

/**
 * Delete a product by its ID.
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<Product|null>} The deleted product document, or null if not found.
 */
const deleteProductById = productId => Product.findByIdAndDelete(productId);

module.exports = {
  createProduct,
  queryProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};