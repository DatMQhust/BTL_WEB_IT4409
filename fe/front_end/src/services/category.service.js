import api from './api';

// Get all categories
export const getAllCategories = async () => {
  const response = await api.get('/category');
  return response.data;
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  const response = await api.get(`/category/${categoryId}`);
  return response.data;
};

// Create category
export const createCategory = async (categoryData) => {
  const response = await api.post('/category', categoryData);
  return response.data;
};

// Update category
export const updateCategory = async (categoryId, categoryData) => {
  const response = await api.put(`/category/${categoryId}`, categoryData);
  return response.data;
};

// Delete category
export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/category/${categoryId}`);
  return response.data;
};
