import { productApi } from "../api/product.api";
import type { Product } from "../types/product.type";

// Helper function để parse response
const parseResponse = (response: any) => {
  let data;
  if (typeof response.data === 'string') {
    const jsonString = response.data.replace(/^\/\/ bootstrap\/app\.php\n/, '');
    data = JSON.parse(jsonString);
  } else {
    data = response.data;
  }
  return Array.isArray(data) ? data : (data.data || data);
};

export const getAllProducts = async () => {
  try {
    const response = await productApi.getAll();
    const data = parseResponse(response);
    return { data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [] };
  }
};

export const getProductById = async (id: number) => {
  try {
    const response = await productApi.getById(id);
    const data = parseResponse(response);
    return { data };
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (data: FormData | Partial<Product>) => {
  try {
    const response = await productApi.create(data);
    return parseResponse(response);
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (id: number, data: FormData | Partial<Product>) => {
  try {
    const response = await productApi.update(id, data);
    return parseResponse(response);
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const response = await productApi.delete(id);
    return parseResponse(response);
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};

export const searchProducts = async (keyword: string) => {
  try {
    const response = await productApi.search(keyword);
    const data = parseResponse(response);
    return { data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error(`Error searching products with keyword "${keyword}":`, error);
    return { data: [] };
  }
};

export const getTrashedProducts = async () => {
  try {
    const response = await productApi.getTrashed();
    const data = parseResponse(response);
    return { data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("Error fetching trashed products:", error);
    return { data: [] };
  }
};

export const restoreProduct = async (id: number) => {
  try {
    const response = await productApi.restore(id);
    return parseResponse(response);
  } catch (error) {
    console.error(`Error restoring product with id ${id}:`, error);
    throw error;
  }
};

export const toggleActiveProduct = async (id: number) => {
  try {
    const response = await productApi.toggleActive(id);
    return parseResponse(response);
  } catch (error) {
    console.error(`Error toggling active status for product with id ${id}:`, error);
    throw error;
  }
};