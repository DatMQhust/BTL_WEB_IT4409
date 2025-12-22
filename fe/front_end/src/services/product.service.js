import api from './api';

// Get all products
export const getAllProducts = async (params = {}) => {
  const response = await api.get('/product', { params });
  return response.data;
};

// Get product by ID
export const getProductById = async (productId) => {
  const response = await api.get(`/product/${productId}`);
  return response.data;
};

// Create product
export const createProduct = async (productData) => {
  const response = await api.post('/product', productData);
  return response.data;
};

// Update product
export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/product/${productId}`, productData);
  return response.data;
};

// Delete product
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/product/${productId}`);
  return response.data;
};
