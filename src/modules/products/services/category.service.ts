import { categoryApi } from "../api/category.api";
import type { Category } from "../types/category.type";

export const getAllCategories = async () => {
  try {
    const response = await categoryApi.getAll();
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategoryById = async (id: number) => {
  try {
    const response = await categoryApi.getById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
};

export const createCategory = async (data: Partial<Category>) => {
  try {
    const response = await categoryApi.create(data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (id: number, data: Partial<Category>) => {
  try {
    const response = await categoryApi.update(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const response = await categoryApi.delete(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
};