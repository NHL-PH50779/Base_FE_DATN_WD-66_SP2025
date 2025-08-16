import axios from "axios";
import type { Category } from "../types/category.type";

const API_URL = "http://127.0.0.1:8000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get("/categories");
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
  create: async (data: Omit<Category, 'id'>): Promise<Category> => {
    const response = await axiosInstance.post("/admin/categories", data);
    return response.data.data || response.data;
  },
  update: async (id: number, data: Omit<Category, 'id'>): Promise<Category> => {
    const response = await axiosInstance.put(`/admin/categories/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/categories/${id}`);
  },
};
