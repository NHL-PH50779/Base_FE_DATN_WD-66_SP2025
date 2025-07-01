import { axiosInstance } from "../utils/axios.util";

const parseResponse = (response: any) => {
  let data;
  if (typeof response.data === 'string') {
    const jsonString = response.data
      .replace(/^\/\/ bootstrap\/app\.php\n/, '')
      .replace(/<<<<<<< HEAD\n/g, '')
      .replace(/=======\n/g, '')
      .replace(/>>>>>>> [^\n]+\n/g, '');
    data = JSON.parse(jsonString);
  } else {
    data = response.data;
  }
  return data;
};

export const brandService = {
  getAllBrands: async () => {
    try {
      const response = await axiosInstance.get("/brands");
      const data = parseResponse(response);
      return { data: Array.isArray(data) ? data : (data.data || []) };
    } catch (error) {
      console.error("Error fetching brands:", error);
      return { data: [] };
    }
  },

  getBrandById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/brands/${id}`);
      const data = parseResponse(response);
      return { data };
    } catch (error) {
      console.error(`Error fetching brand ${id}:`, error);
      throw error;
    }
  },

  createBrand: async (brandData: { name: string }) => {
    try {
      const response = await axiosInstance.post("/admin/brands", brandData);
      return parseResponse(response);
    } catch (error) {
      console.error("Error creating brand:", error);
      throw error;
    }
  },

  updateBrand: async (id: number, brandData: { name: string }) => {
    try {
      const response = await axiosInstance.put(`/admin/brands/${id}`, brandData);
      return parseResponse(response);
    } catch (error) {
      console.error("Error updating brand:", error);
      throw error;
    }
  },

  deleteBrand: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/admin/brands/${id}`);
      return parseResponse(response);
    } catch (error) {
      console.error("Error deleting brand:", error);
      throw error;
    }
  }
};