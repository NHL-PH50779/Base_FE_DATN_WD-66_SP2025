import { axiosInstance } from "../../../utils/axios.util";
import type { Order } from "../types/order.type";

export const orderApi = {
  getAll: async () => {
    const response = await axiosInstance.get("/orders");
    return response;
  },
  
  getById: async (id: number) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response;
  },
  
  create: async (data: Partial<Order>) => {
    const response = await axiosInstance.post("/orders", data);
    return response;
  },
  
  update: async (id: number, data: Partial<Order>) => {
    const response = await axiosInstance.put(`/orders/${id}`, data);
    return response;
  },
  
  updateStatus: async (id: number, status: string) => {
    const response = await axiosInstance.put(`/orders/${id}/status`, { status });
    return response;
  },
  
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/orders/${id}`);
    return response;
  },
};