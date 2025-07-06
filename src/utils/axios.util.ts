import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  isAuthApi?: boolean;
}

// Cấu hình API URL cho Laravel backend
const API_URL = "http://localhost:8000/api"; // Đổi từ 127.0.0.1 sang localhost

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000, // Giảm timeout xuống 5 giây
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Xử lý response
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Xử lý timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.log(`API Timeout: ${error.config?.url}`);
      return Promise.reject(new Error('Kết nối timeout - Vui lòng kiểm tra server Laravel'));
    }
    
    console.error("API Error:", error.response?.data || error.message);
    
    // Nếu lỗi 401 (Unauthorized), xóa token và redirect về login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Nếu không có response (server offline)
    if (!error.response) {
      console.error("Backend server không khả dụng. Vui lòng kiểm tra server Laravel.");
      return Promise.reject(new Error('Server không khả dụng'));
    }
    
    return Promise.reject(error);
  }
);

// Xử lý request - tự động thêm token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);