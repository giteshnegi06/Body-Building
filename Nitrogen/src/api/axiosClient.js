import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://backend-tf26.onrender.com/api/v1',
  withCredentials: true, // Send cookies when cross-domain requests
  headers: {
    'Content-Type': 'application/json',
  },
});

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
