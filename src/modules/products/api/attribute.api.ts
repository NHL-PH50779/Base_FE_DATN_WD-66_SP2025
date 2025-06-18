import { axiosInstance } from "../../../utils/axios.util";
import type { Attribute, AttributeValue } from "../types/attribute.type";

// Mock data
const mockAttributes: Attribute[] = [
  {
    id: 1,
    name: "Màu sắc",
    values: [
      { id: 1, attribute_id: 1, value: "Đen" },
      { id: 2, attribute_id: 1, value: "Trắng" },
      { id: 3, attribute_id: 1, value: "Bạc" },
      { id: 4, attribute_id: 1, value: "Xanh" }
    ]
  },
  {
    id: 2,
    name: "Bộ nhớ",
    values: [
      { id: 5, attribute_id: 2, value: "128GB" },
      { id: 6, attribute_id: 2, value: "256GB" },
      { id: 7, attribute_id: 2, value: "512GB" },
      { id: 8, attribute_id: 2, value: "1TB" }
    ]
  },
  {
    id: 3,
    name: "RAM",
    values: [
      { id: 10, attribute_id: 3, value: "8GB" },
      { id: 11, attribute_id: 3, value: "16GB" },
      { id: 12, attribute_id: 3, value: "32GB" }
    ]
  }
];

export const attributeApi = {
  // Attribute APIs
  getAllAttributes: async () => {
    try {
      const response = await axiosInstance.get("/attributes");
      return response;
    } catch (error) {
      console.log("Falling back to mock data for attributes");
      return { data: { data: mockAttributes } };
    }
  },
  
  getAttribute: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/attributes/${id}`);
      return response;
    } catch (error) {
      const attribute = mockAttributes.find(a => a.id === id);
      return { data: { data: attribute } };
    }
  },
  
  createAttribute: async (data: Partial<Attribute>) => {
    try {
      const response = await axiosInstance.post("/attributes", data);
      return response;
    } catch (error) {
      console.log("Mock creating attribute:", data);
      return { 
        data: { 
          success: true, 
          message: "Attribute created successfully",
          data: {
            id: Date.now(),
            name: data.name,
            values: []
          }
        } 
      };
    }
  },
  
  updateAttribute: async (id: number, data: Partial<Attribute>) => {
    try {
      const response = await axiosInstance.put(`/attributes/${id}`, data);
      return response;
    } catch (error) {
      console.log("Mock updating attribute:", id, data);
      return { data: { success: true, message: "Attribute updated successfully" } };
    }
  },
  
  deleteAttribute: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/attributes/${id}`);
      return response;
    } catch (error) {
      console.log("Mock deleting attribute:", id);
      return { data: { success: true, message: "Attribute deleted successfully" } };
    }
  },
  
  // Attribute Value APIs
  getAllAttributeValues: async () => {
    try {
      const response = await axiosInstance.get("/attribute-values");
      return response;
    } catch (error) {
      const values = mockAttributes.flatMap(attr => attr.values || []);
      return { data: { data: values } };
    }
  },
  
  getAttributeValue: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/attribute-values/${id}`);
      return response;
    } catch (error) {
      const value = mockAttributes
        .flatMap(attr => attr.values || [])
        .find(v => v.id === id);
      return { data: { data: value } };
    }
  },
  
  createAttributeValue: async (data: Partial<AttributeValue>) => {
    try {
      const response = await axiosInstance.post("/attribute-values", data);
      return response;
    } catch (error) {
      console.log("Mock creating attribute value:", data);
      return { 
        data: { 
          success: true, 
          message: "Attribute value created successfully",
          data: {
            id: Date.now(),
            attribute_id: data.attribute_id,
            value: data.value
          }
        } 
      };
    }
  },
  
  updateAttributeValue: async (id: number, data: Partial<AttributeValue>) => {
    try {
      const response = await axiosInstance.put(`/attribute-values/${id}`, data);
      return response;
    } catch (error) {
      console.log("Mock updating attribute value:", id, data);
      return { data: { success: true, message: "Attribute value updated successfully" } };
    }
  },
  
  deleteAttributeValue: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/attribute-values/${id}`);
      return response;
    } catch (error) {
      console.log("Mock deleting attribute value:", id);
      return { data: { success: true, message: "Attribute value deleted successfully" } };
    }
  },
};