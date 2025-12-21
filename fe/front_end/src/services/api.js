import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use the base URL from environment variables
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the error is 401, logout the user
    if (error.response && error.response.status === 401) {
      // Check if this is not a login attempt to avoid logout loops
      if (!error.config.url.endsWith('/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = '/'; 
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
