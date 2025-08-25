import { axiosInstance } from "../utils/axios.util";

const parseResponse = (response: any) => {
  let data;
  if (typeof response.data === 'string') {
    const jsonString = response.data
      .replace(/^\/\/ bootstrap\/app\.php\n/, '')
      .replace(/<<<<<<< HEAD\n/g, '')
      .replace(/=======\n/g, '')
      .replace(/>>>>>>> [^\n]+\n/g, '');
    data = JSON.parse(jsonString);
  } else {
    data = response.data;
  }
  return data;
};

export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await axiosInstance.get("/categories", {
        timeout: 45000, // Timeout riêng cho categories
      });
      const data = parseResponse(response);
      return { data: Array.isArray(data) ? data : (data.data || []) };
    } catch (error: any) {
      console.error("Error fetching categories:", error.message);
      
      // Fallback data khi lỗi
      if (error.message.includes('timeout') || error.message.includes('Network')) {
        return {
          data: [],
          error: 'Kết nối chậm - Dữ liệu sẽ được tải lại tự động'
        };
      }
      
      return { data: [], error: error.message };
    }
  },

  getCategoryById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/categories/${id}`, {
        timeout: 30000,
      });
      const data = parseResponse(response);
      return { data };
    } catch (error: any) {
      console.error(`Error fetching category ${id}:`, error.message);
      
      if (error.message.includes('timeout')) {
        throw new Error('Kết nối chậm - Vui lòng thử lại');
      }
      throw error;
    }
  },

  createCategory: async (categoryData: { name: string }) => {
    try {
      const response = await axiosInstance.post("/admin/categories", categoryData, {
        timeout: 30000,
      });
      return parseResponse(response);
    } catch (error: any) {
      console.error("Error creating category:", error.message);
      
      if (error.message.includes('timeout')) {
        throw new Error('Kết nối chậm - Vui lòng thử lại');
      }
      throw error;
    }
  },

  updateCategory: async (id: number, categoryData: { name: string }) => {
    try {
      const response = await axiosInstance.put(`/admin/categories/${id}`, categoryData, {
        timeout: 30000,
      });
      return parseResponse(response);
    } catch (error: any) {
      console.error("Error updating category:", error.message);
      
      if (error.message.includes('timeout')) {
        throw new Error('Kết nối chậm - Vui lòng thử lại');
      }
      throw error;
    }
  },

  deleteCategory: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/admin/categories/${id}`, {
        timeout: 30000,
      });
      return parseResponse(response);
    } catch (error: any) {
      console.error("Error deleting category:", error.message);
      
      if (error.message.includes('timeout')) {
        throw new Error('Kết nối chậm - Vui lòng thử lại');
      }
      throw error;
    }
  }
};