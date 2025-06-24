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
      const response = await axiosInstance.get("/categories");
      const data = parseResponse(response);
      return { data: Array.isArray(data) ? data : (data.data || []) };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return { data: [] };
    }
  },

  getCategoryById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/categories/${id}`);
      const data = parseResponse(response);
      return { data };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  createCategory: async (categoryData: { name: string }) => {
    try {
      const response = await axiosInstance.post("/categories", categoryData);
      return parseResponse(response);
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  updateCategory: async (id: number, categoryData: { name: string }) => {
    try {
      const response = await axiosInstance.put(`/categories/${id}`, categoryData);
      return parseResponse(response);
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  deleteCategory: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/categories/${id}`);
      return parseResponse(response);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
};