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
  timeout: 30000, // Tăng timeout lên 30s
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  // Retry config
  retry: 3,
  retryDelay: 2000,
  // Adaptive timeout dựa trên connection
  validateStatus: (status) => status < 500, // Chấp nhận 4xx errors
});

// Network quality detection
let networkQuality = 'good';
let lastRequestTime = Date.now();

// Adaptive timeout based on network
const getAdaptiveTimeout = () => {
  switch (networkQuality) {
    case 'slow': return 60000; // 60s for slow network
    case 'medium': return 45000; // 45s for medium network
    default: return 30000; // 30s for good network
  }
};

// Xử lý response với adaptive retry
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Update network quality based on response time
    const responseTime = Date.now() - lastRequestTime;
    if (responseTime > 10000) networkQuality = 'slow';
    else if (responseTime > 5000) networkQuality = 'medium';
    else networkQuality = 'good';
    
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Xử lý timeout với adaptive retry
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.log(`API Timeout: ${config?.url} (Network: ${networkQuality})`);
      
      if (config && !config._retryCount) config._retryCount = 0;
      
      // Retry với timeout tăng dần
      if (config && config._retryCount < 3) {
        config._retryCount++;
        config.timeout = getAdaptiveTimeout() + (config._retryCount * 15000);
        
        console.log(`Retrying (${config._retryCount}/3) with timeout: ${config.timeout}ms`);
        await new Promise(resolve => setTimeout(resolve, config._retryCount * 3000));
        return axiosInstance(config);
      }
      
      return Promise.reject(new Error('Kết nối chậm - Vui lòng thử lại'));
    }
    
    // Xử lý lỗi mạng
    if (!error.response) {
      if (config && !config._retryCount) config._retryCount = 0;
      
      if (config && config._retryCount < 2 && navigator.onLine) {
        config._retryCount++;
        config.timeout = getAdaptiveTimeout();
        
        console.log(`Network retry (${config._retryCount}/2)`);
        await new Promise(resolve => setTimeout(resolve, config._retryCount * 5000));
        return axiosInstance(config);
      }
      
      const errorMessage = navigator.onLine 
        ? 'Server không khả dụng'
        : 'Không có kết nối internet';
      return Promise.reject(new Error(errorMessage));
    }
    
    // Xử lý 401
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Xử lý request với adaptive timeout
axiosInstance.interceptors.request.use(
  (config) => {
    lastRequestTime = Date.now();
    
    // Set adaptive timeout if not specified
    if (!config.timeout || config.timeout === 30000) {
      config.timeout = getAdaptiveTimeout();
    }
    
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