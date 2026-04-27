import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const register = (name, email, password, role = 'student') =>
  api.post('/auth/register', { name, email, password, role });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

// Book APIs
export const getBooks = () => api.get('/books');
export const getBook = (id) => api.get(`/books/${id}`);
export const addBook = (bookData) => api.post('/books', bookData);

// Borrow APIs
export const requestBorrow = (bookId) => api.post('/borrow/request', { bookId });
export const getMyBorrows = () => api.get('/borrow/my-borrows');
export const getPendingRequests = () => api.get('/borrow/pending');
export const approveRequest = (requestId) => api.put(`/borrow/approve/${requestId}`);
// Delete a book (admin only)
export const deleteBook = (bookId) => api.delete(`/books/${bookId}`);


export default api;