import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://body-building-blush.vercel.app/api/v1',
  withCredentials: true, // Send cookies when cross-domain requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
