import { axiosInstance } from "../../../utils/axios.util";
import type { Attribute, AttributeValue } from "../types/attribute.type";

export const attributeApi = {
  // Attribute APIs
  getAllAttributes: async () => {
    const response = await axiosInstance.get("/attributes", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  getAttribute: async (id: number) => {
    const response = await axiosInstance.get(`/attributes/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  createAttribute: async (data: Partial<Attribute>) => {
    const response = await axiosInstance.post("/attributes", data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  updateAttribute: async (id: number, data: Partial<Attribute>) => {
    const response = await axiosInstance.put(`/attributes/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  deleteAttribute: async (id: number) => {
    const response = await axiosInstance.delete(`/attributes/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  // Attribute Value APIs
  getAllAttributeValues: async () => {
    const response = await axiosInstance.get("/attribute-values", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  getAttributeValue: async (id: number) => {
    const response = await axiosInstance.get(`/attribute-values/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  createAttributeValue: async (data: Partial<AttributeValue>) => {
    const response = await axiosInstance.post("/attribute-values", data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  updateAttributeValue: async (id: number, data: Partial<AttributeValue>) => {
    const response = await axiosInstance.put(`/attribute-values/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
  
  deleteAttributeValue: async (id: number) => {
    const response = await axiosInstance.delete(`/attribute-values/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response;
  },
};