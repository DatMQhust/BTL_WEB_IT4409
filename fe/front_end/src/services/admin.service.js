import api from './api';

// Dashboard Stats
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

// Revenue Stats
export const getRevenueStats = async (period = 'month', year = null, month = null) => {
  const params = { period };
  if (year) params.year = year;
  if (month) params.month = month;
  
  const response = await api.get('/admin/revenue', { params });
  return response.data;
};

// Inventory Report
export const getInventoryReport = async () => {
  const response = await api.get('/admin/inventory');
  return response.data;
};

// Best Selling Products
export const getBestSellingProducts = async (limit = 10, period = 'all') => {
  const response = await api.get('/admin/best-selling', { params: { limit, period } });
  return response.data;
};

// Sales By Category
export const getSalesByCategory = async (period = 'all') => {
  const response = await api.get('/admin/sales-by-category', { params: { period } });
  return response.data;
};

// Customer Stats
export const getCustomerStats = async () => {
  const response = await api.get('/admin/customers');
  return response.data;
};

// Get all users (for Users page)
export const getAllUsers = async () => {
  const response = await api.get('/user/all');
  return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
  const response = await api.delete(`/user/${userId}`);
  return response.data;
};

// Update user role (admin only)
export const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/user/${userId}/role`, { role });
  return response.data;
};

// Get all orders (for Orders page)
export const getAllOrders = async () => {
  const response = await api.get('/orders/admin');
  return response.data;
};

// Update order status
export const updateOrderStatus = async (orderId, status, paymentStatus) => {
  const response = await api.patch(`/orders/admin/${orderId}`, { status, paymentStatus });
  return response.data;
};

// Get order details
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};
