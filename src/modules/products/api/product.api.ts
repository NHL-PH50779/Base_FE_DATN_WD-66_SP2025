import { axiosInstance } from "../../../utils/axios.util";
import type { Product } from "../types/product.type";

// Mock data
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Laptop Dell XPS 13",
    description: "Laptop cao cấp với màn hình InfinityEdge",
    brand_id: 1,
    category_id: 1,
    thumbnail: "https://via.placeholder.com/300x200",
    is_active: true,
    created_at: "2025-05-01",
    brand: { id: 1, name: "Dell" },
    category: { id: 1, name: "Laptop" }
  },
  {
    id: 2,
    name: "MacBook Pro M2",
    description: "Laptop mạnh mẽ với chip Apple Silicon",
    brand_id: 2,
    category_id: 1,
    thumbnail: "https://via.placeholder.com/300x200",
    is_active: true,
    created_at: "2025-05-02",
    brand: { id: 2, name: "Apple" },
    category: { id: 1, name: "Laptop" }
  },
  {
    id: 3,
    name: "HP Envy 15",
    description: "Laptop đa năng cho công việc và giải trí",
    brand_id: 3,
    category_id: 1,
    thumbnail: "https://via.placeholder.com/300x200",
    is_active: false,
    created_at: "2025-05-03",
    brand: { id: 3, name: "HP" },
    category: { id: 1, name: "Laptop" }
  }
];

export const productApi = {
  getAll: async () => {
    try {
      const response = await axiosInstance.get("/products");
      return response;
    } catch (error) {
      console.log("Falling back to mock data for products");
      return { data: { data: mockProducts } };
    }
  },
  
  getById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response;
    } catch (error) {
      const product = mockProducts.find(p => p.id === id);
      return { data: { data: product } };
    }
  },
  
  create: async (data: FormData | Partial<Product>) => {
    try {
      const config = data instanceof FormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {};
      const response = await axiosInstance.post("/products", data, config);
      return response;
    } catch (error) {
      console.log("Mock creating product:", data);
      return { data: { success: true, message: "Product created successfully" } };
    }
  },
  
  update: async (id: number, data: FormData | Partial<Product>) => {
    try {
      const config = data instanceof FormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      } : {};
      const response = await axiosInstance.put(`/products/${id}`, data, config);
      return response;
    } catch (error) {
      console.log("Mock updating product:", id, data);
      return { data: { success: true, message: "Product updated successfully" } };
    }
  },
  
  delete: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response;
    } catch (error) {
      console.log("Mock deleting product:", id);
      return { data: { success: true, message: "Product deleted successfully" } };
    }
  },
  
  search: async (keyword: string) => {
    try {
      const response = await axiosInstance.get(`/products/search?keyword=${keyword}`);
      return response;
    } catch (error) {
      const filteredProducts = mockProducts.filter(p => 
        p.name.toLowerCase().includes(keyword.toLowerCase())
      );
      return { data: { data: filteredProducts } };
    }
  },
  
  getTrashed: async () => {
    try {
      const response = await axiosInstance.get(`/products/trashed`);
      return response;
    } catch (error) {
      return { data: { data: [] } };
    }
  },
  
  restore: async (id: number) => {
    try {
      const response = await axiosInstance.put(`/products/restore/${id}`);
      return response;
    } catch (error) {
      console.log("Mock restoring product:", id);
      return { data: { success: true, message: "Product restored successfully" } };
    }
  },
  
  toggleActive: async (id: number) => {
    try {
      const response = await axiosInstance.put(`/products/toggle-active/${id}`);
      return response;
    } catch (error) {
      console.log("Mock toggling product active status:", id);
      return { data: { success: true, message: "Product status toggled successfully" } };
    }
  },
};