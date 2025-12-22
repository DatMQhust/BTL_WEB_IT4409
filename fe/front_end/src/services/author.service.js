import api from './api';

// Get all authors
export const getAllAuthors = async () => {
  const response = await api.get('/author');
  return response.data;
};

// Get author by ID
export const getAuthorById = async (authorId) => {
  const response = await api.get(`/author/${authorId}`);
  return response.data;
};

// Create author
export const createAuthor = async (authorData) => {
  const response = await api.post('/author', authorData);
  return response.data;
};

// Update author
export const updateAuthor = async (authorId, authorData) => {
  const response = await api.put(`/author/${authorId}`, authorData);
  return response.data;
};

// Delete author
export const deleteAuthor = async (authorId) => {
  const response = await api.delete(`/author/${authorId}`);
  return response.data;
};
