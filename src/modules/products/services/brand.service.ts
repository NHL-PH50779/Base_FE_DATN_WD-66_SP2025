import { brandApi } from "../api/brand.api";
import type { Brand } from "../types/brand.type";

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

export const getAllBrands = async () => {
  try {
    const response = await brandApi.getAll();
    const data = parseResponse(response);
    return { data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("Error fetching brands:", error);
    return { data: [] };
  }
};

export const getBrandById = async (id: number) => {
  try {
    const response = await brandApi.getById(id);
    const data = parseResponse(response);
    return { data };
  } catch (error) {
    console.error(`Error fetching brand with id ${id}:`, error);
    throw error;
  }
};

export const createBrand = async (data: Partial<Brand>) => {
  try {
    const response = await brandApi.create(data);
    return parseResponse(response);
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
};

export const updateBrand = async (id: number, data: Partial<Brand>) => {
  try {
    const response = await brandApi.update(id, data);
    return parseResponse(response);
  } catch (error) {
    console.error(`Error updating brand with id ${id}:`, error);
    throw error;
  }
};

export const deleteBrand = async (id: number) => {
  try {
    const response = await brandApi.delete(id);
    return parseResponse(response);
  } catch (error) {
    console.error(`Error deleting brand with id ${id}:`, error);
    throw error;
  }
};