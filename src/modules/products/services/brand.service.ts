import { brandApi } from "../api/brand.api";
import type { Brand } from "../types/brand.type";

export const getAllBrands = async () => {
  try {
    const response = await brandApi.getAll();
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const getBrandById = async (id: number) => {
  try {
    const response = await brandApi.getById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching brand with id ${id}:`, error);
    throw error;
  }
};

export const createBrand = async (data: Partial<Brand>) => {
  try {
    const response = await brandApi.create(data);
    return response.data;
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
};

export const updateBrand = async (id: number, data: Partial<Brand>) => {
  try {
    const response = await brandApi.update(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating brand with id ${id}:`, error);
    throw error;
  }
};

export const deleteBrand = async (id: number) => {
  try {
    const response = await brandApi.delete(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting brand with id ${id}:`, error);
    throw error;
  }
};