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
    const response = await axiosInstance.post("/categories", data);
    return response;
  },
  
  update: async (id: number, data: Partial<Category>) => {
    const response = await axiosInstance.put(`/categories/${id}`, data);
    return response;
  },
  
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response;
  },
};