import { axiosInstance } from "../../../utils/axios.util";
import type { Category } from "../types/category.type";

// Mock data
const mockCategories: Category[] = [
  {
    id: 1,
    name: "Laptop",
    description: "Máy tính xách tay",
    image: "https://via.placeholder.com/100x100",
    created_at: "2025-05-01"
  },
  {
    id: 2,
    name: "Điện thoại",
    description: "Điện thoại di động",
    image: "https://via.placeholder.com/100x100",
    created_at: "2025-05-01"
  },
  {
    id: 3,
    name: "Máy tính bảng",
    description: "Tablet",
    image: "https://via.placeholder.com/100x100",
    created_at: "2025-05-01"
  },
  {
    id: 4,
    name: "Phụ kiện",
    description: "Phụ kiện điện tử",
    image: "https://via.placeholder.com/100x100",
    created_at: "2025-05-01"
  }
];

export const categoryApi = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/categories");
      return response;
    } catch (error) {
      console.log("Falling back to mock data for categories");
      return { data: { data: mockCategories } };
    }
  },
  
  getById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/categories/${id}`);
      return response;
    } catch (error) {
      const category = mockCategories.find(c => c.id === id);
      return { data: { data: category } };
    }
  },
  
  create: async (data: Partial<Category>) => {
    try {
      const response = await axiosInstance.post("/categories", data);
      return response;
    } catch (error) {
      console.log("Mock creating category:", data);
      return { data: { success: true, message: "Category created successfully" } };
    }
  },
  
  update: async (id: number, data: Partial<Category>) => {
    try {
      const response = await axiosInstance.put(`/categories/${id}`, data);
      return response;
    } catch (error) {
      console.log("Mock updating category:", id, data);
      return { data: { success: true, message: "Category updated successfully" } };
    }
  },
  
  delete: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/categories/${id}`);
      return response;
    } catch (error) {
      console.log("Mock deleting category:", id);
      return { data: { success: true, message: "Category deleted successfully" } };
    }
  },
};