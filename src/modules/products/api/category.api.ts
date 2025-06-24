import { axiosInstance } from "../../../utils/axios.util";
import type { Category } from "../types/category.type";

export const categoryApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/categories");
    return response;
  },
  
  getById: async (id: number) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response;
  },
  
  create: async (data: Partial<Category>) => {
    // Cần auth token và admin role
    const response = await axiosInstance.post("/categories", data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  update: async (id: number, data: Partial<Category>) => {
    const response = await axiosInstance.put(`/categories/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/categories/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
};