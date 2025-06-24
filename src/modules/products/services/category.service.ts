import { categoryApi } from "../api/category.api";
import type { Category } from "../types/category.type";

// Helper function để parse response
const parseResponse = (response: any) => {
  let data;
  if (typeof response.data === 'string') {
    // Loại bỏ phần bootstrap comment và Git conflict markers
    const jsonString = response.data
      .replace(/^\/\/ bootstrap\/app\.php\n/, '')
      .replace(/<<<<<<< HEAD\n/g, '')
      .replace(/=======\n/g, '')
      .replace(/>>>>>>> [^\n]+\n/g, '');
    data = JSON.parse(jsonString);
  } else {
    data = response.data;
  }
  return Array.isArray(data) ? data : (data.data || data);
};

export const getAllCategories = async () => {
  try {
    const response = await categoryApi.getAll();
    const data = parseResponse(response);
    return { data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: [] };
  }
};

export const getCategoryById = async (id: number) => {
  try {
    const response = await categoryApi.getById(id);
    const data = parseResponse(response);
    return { data };
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
};

export const createCategory = async (data: Partial<Category>) => {
  try {
    const response = await categoryApi.create(data);
    return parseResponse(response);
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (id: number, data: Partial<Category>) => {
  try {
    const response = await categoryApi.update(id, data);
    return parseResponse(response);
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const response = await categoryApi.delete(id);
    return parseResponse(response);
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
};