import { axiosInstance } from "../../../utils/axios.util";
import type { Product } from "../types/product.type";

export const productApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/products");
    return response;
  },
  
  getById: async (id: number) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response;
  },
  
  create: async (data: FormData | Partial<Product>) => {
    const config = data instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    } : {};
    const response = await axiosInstance.post("/products", data, config);
    return response;
  },
  
  update: async (id: number, data: FormData | Partial<Product>) => {
    const config = data instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    } : {};
    const response = await axiosInstance.put(`/products/${id}`, data, config);
    return response;
  },
  
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response;
  },
  
  search: async (keyword: string) => {
    const response = await axiosInstance.get(`/products/search?keyword=${keyword}`);
    return response;
  },
  
  getTrashed: async () => {
    const response = await axiosInstance.get(`/products/trashed`);
    return response;
  },
  
  restore: async (id: number) => {
    const response = await axiosInstance.put(`/products/restore/${id}`);
    return response;
  },
  
  toggleActive: async (id: number) => {
    const response = await axiosInstance.put(`/products/toggle-active/${id}`);
    return response;
  },
};