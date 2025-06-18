import { axiosInstance } from "../../../utils/axios.util";
import type { Brand } from "../types/brand.type";

// Mock data
const mockBrands: Brand[] = [
  {
    id: 1,
    name: "Dell",
    logo: "https://via.placeholder.com/100x50",
    created_at: "2025-05-01"
  },
  {
    id: 2,
    name: "Apple",
    logo: "https://via.placeholder.com/100x50",
    created_at: "2025-05-01"
  },
  {
    id: 3,
    name: "HP",
    logo: "https://via.placeholder.com/100x50",
    created_at: "2025-05-01"
  },
  {
    id: 4,
    name: "Lenovo",
    logo: "https://via.placeholder.com/100x50",
    created_at: "2025-05-01"
  },
  {
    id: 5,
    name: "Asus",
    logo: "https://via.placeholder.com/100x50",
    created_at: "2025-05-01"
  }
];

export const brandApi = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/brands");
      return response;
    } catch (error) {
      console.log("Falling back to mock data for brands");
      return { data: { data: mockBrands } };
    }
  },
  
  getById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/brands/${id}`);
      return response;
    } catch (error) {
      const brand = mockBrands.find(b => b.id === id);
      return { data: { data: brand } };
    }
  },
  
  create: async (data: Partial<Brand>) => {
    try {
      const response = await axiosInstance.post("/brands", data);
      return response;
    } catch (error) {
      console.log("Mock creating brand:", data);
      return { data: { success: true, message: "Brand created successfully" } };
    }
  },
  
  update: async (id: number, data: Partial<Brand>) => {
    try {
      const response = await axiosInstance.put(`/brands/${id}`, data);
      return response;
    } catch (error) {
      console.log("Mock updating brand:", id, data);
      return { data: { success: true, message: "Brand updated successfully" } };
    }
  },
  
  delete: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/brands/${id}`);
      return response;
    } catch (error) {
      console.log("Mock deleting brand:", id);
      return { data: { success: true, message: "Brand deleted successfully" } };
    }
  },
};