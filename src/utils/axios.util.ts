import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  isAuthApi?: boolean;
}

// Cấu hình API URL cho Laravel backend
const API_URL = "http://127.0.0.1:8000/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json", // Laravel API thường yêu cầu header này
  },
});

// Xử lý response
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Xử lý request
axiosInstance.interceptors.request.use(
  (config) => {
    // Có thể thêm token xác thực ở đây nếu cần
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);