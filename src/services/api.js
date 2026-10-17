import axios from 'axios';

// Create configured axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

/**
 * Helper to resolve image URLs properly
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // When running with proxy or direct
  return imagePath;
};

/**
 * 1. GET /api/hotels with filters and pagination
 */
export const getHotels = async (params = {}) => {
  const response = await api.get('/hotels', { params });
  return response.data;
};

/**
 * 2. GET /api/hotels/:id
 */
export const getHotelById = async (id) => {
  const response = await api.get(`/hotels/${id}`);
  return response.data;
};

/**
 * 3. POST /api/hotels
 */
export const createHotel = async (formData) => {
  const response = await api.post('/hotels', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 4. PUT /api/hotels/:id
 */
export const updateHotel = async (id, formData) => {
  const response = await api.put(`/hotels/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 5. DELETE /api/hotels/:id
 */
export const deleteHotel = async (id) => {
  const response = await api.delete(`/hotels/${id}`);
  return response.data;
};

export default api;
