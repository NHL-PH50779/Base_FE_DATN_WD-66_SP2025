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
  
  search: async (keyword: string) => {
    const response = await axiosInstance.get(`/products/search?keyword=${keyword}`);
    return response;
  },
  
  create: async (data: FormData | Partial<Product>) => {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...(data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    };
    const response = await axiosInstance.post("/products", data, config);
    return response;
  },
  
  update: async (id: number, data: FormData | Partial<Product>) => {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...(data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    };
    const response = await axiosInstance.put(`/products/${id}`, data, config);
    return response;
  },
  
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  getTrashed: async () => {
    const response = await axiosInstance.get(`/products/trashed`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  restore: async (id: number) => {
    const response = await axiosInstance.put(`/products/restore/${id}`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  toggleActive: async (id: number) => {
    const response = await axiosInstance.put(`/products/toggle-active/${id}`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
};