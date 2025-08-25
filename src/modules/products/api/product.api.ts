import { axiosInstance } from "../../../utils/axios.util";
import type { Product } from "../types/product.type";

export const productApi = {
  getAll: async () => {
    const response = await axiosInstance.get(`/products?t=${Date.now()}`);
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
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    const response = await axiosInstance.post("/admin/products", data, config);
    return response;
  },
  
  update: async (id: number, data: FormData | Partial<Product>) => {
    console.log('API update call:', id, data);
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {
      headers: { 'Content-Type': 'application/json' }
    };
    const response = await axiosInstance.put(`/admin/products/${id}?t=${Date.now()}`, data, config);
    console.log('API update response:', response.data);
    return response;
  },
  
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/admin/products/${id}`);
    return response;
  },
  
  restore: async (id: number) => {
    const response = await axiosInstance.put(`/admin/products/restore/${id}`);
    return response;
  },
  
  forceDelete: async (id: number) => {
    const response = await axiosInstance.delete(`/admin/products/force-delete/${id}`);
    return response;
  },
  
  getTrashed: async () => {
    const response = await axiosInstance.get("/admin/products/trashed");
    return response;
  },

  toggleActive: async (id: number) => {
    const response = await axiosInstance.put(`/admin/products/toggle-active/${id}`);
    return response;
  },

  getByBrand: async (brandId: number) => {
    const response = await axiosInstance.get(`/products-by-brand/${brandId}`);
    return response;
  },

  getByCategory: async (categoryId: number) => {
    const response = await axiosInstance.get(`/products-by-category/${categoryId}`);
    return response;
  },
};