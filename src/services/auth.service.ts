import { axiosInstance } from "../utils/axios.util";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
}

export const authService = {
  login: async (data: LoginData) => {
    try {
      const response = await axiosInstance.post("/login", data);
      console.log('Raw response data:', response.data);
      
      // Response data là string, cần parse JSON
      let jsonData;
      if (typeof response.data === 'string') {
        // Loại bỏ phần "// bootstrap/app.php\n" ở đầu
        const jsonString = response.data.replace(/^\/\/ bootstrap\/app\.php\n/, '');
        console.log('Cleaned JSON string:', jsonString);
        jsonData = JSON.parse(jsonString);
      } else {
        jsonData = response.data;
      }
      
      console.log('Parsed JSON data:', jsonData);
      console.log('Token:', jsonData.token);
      console.log('User:', jsonData.user);
      
      if (jsonData.token && jsonData.user) {
        localStorage.setItem('token', jsonData.token);
        localStorage.setItem('user', JSON.stringify(jsonData.user));
        
        console.log('Successfully saved token and user');
        return jsonData;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    const response = await axiosInstance.post("/register", data);
    
    // Xử lý tương tự cho register
    let jsonData;
    if (typeof response.data === 'string') {
      const jsonString = response.data.replace(/^\/\/ bootstrap\/app\.php\n/, '');
      jsonData = JSON.parse(jsonString);
    } else {
      jsonData = response.data;
    }
    
    if (jsonData.token) {
      localStorage.setItem('token', jsonData.token);
      localStorage.setItem('user', JSON.stringify(jsonData.user));
    }
    return jsonData;
  },

  logout: async () => {
    try {
      await axiosInstance.post("/logout");
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getToken: () => localStorage.getItem('token'),
  
  getUser: () => {
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
  
  isAdmin: () => {
    const user = authService.getUser();
    return user?.role === 'admin';
  }
};