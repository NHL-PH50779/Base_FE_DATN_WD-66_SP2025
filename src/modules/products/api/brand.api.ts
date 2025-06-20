import { axiosInstance } from "../../../utils/axios.util";
import type { Brand } from "../types/brand.type";

export const brandApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/brands");
    return response;
  },
  
  getById: async (id: number) => {
    const response = await axiosInstance.get(`/brands/${id}`);
    return response;
  },
  
  create: async (data: Partial<Brand>) => {
    const response = await axiosInstance.post("/brands", data);
    return response;
  },
  
  update: async (id: number, data: Partial<Brand>) => {
    const response = await axiosInstance.put(`/brands/${id}`, data);
    return response;
  },
  
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/brands/${id}`);
    return response;
  },
};