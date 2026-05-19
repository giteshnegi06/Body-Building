import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
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
