import { productApi } from "../api/product.api";
import type { Product } from "../types/product.type";

export const getAllProducts = async () => {
  try {
    const response = await productApi.getAll();
    // Đảm bảo trả về array cho Table component
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return { data: response.data.data };
    } else if (Array.isArray(response.data)) {
      return { data: response.data };
    } else {
      return { data: [] }; // Trả về array rỗng nếu không có dữ liệu
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [] }; // Trả về array rỗng khi có lỗi
  }
};

export const getProductById = async (id: number) => {
  try {
    const response = await productApi.getById(id);
    if (response.data && response.data.data) {
      return { data: response.data.data };
    } else {
      return response;
    }
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (data: FormData | Partial<Product>) => {
  try {
    const response = await productApi.create(data);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (id: number, data: FormData | Partial<Product>) => {
  try {
    const response = await productApi.update(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const response = await productApi.delete(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};

export const searchProducts = async (keyword: string) => {
  try {
    const response = await productApi.search(keyword);
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return { data: response.data.data };
    } else if (Array.isArray(response.data)) {
      return { data: response.data };
    } else {
      return { data: [] };
    }
  } catch (error) {
    console.error(`Error searching products with keyword "${keyword}":`, error);
    return { data: [] };
  }
};

export const getTrashedProducts = async () => {
  try {
    const response = await productApi.getTrashed();
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return { data: response.data.data };
    } else if (Array.isArray(response.data)) {
      return { data: response.data };
    } else {
      return { data: [] };
    }
  } catch (error) {
    console.error("Error fetching trashed products:", error);
    return { data: [] };
  }
};

export const restoreProduct = async (id: number) => {
  try {
    const response = await productApi.restore(id);
    return response.data;
  } catch (error) {
    console.error(`Error restoring product with id ${id}:`, error);
    throw error;
  }
};

export const toggleActiveProduct = async (id: number) => {
  try {
    const response = await productApi.toggleActive(id);
    return response.data;
  } catch (error) {
    console.error(`Error toggling active status for product with id ${id}:`, error);
    throw error;
  }
};