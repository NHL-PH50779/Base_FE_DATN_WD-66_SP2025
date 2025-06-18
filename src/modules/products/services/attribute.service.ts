import { attributeApi } from "../api/attribute.api";
import type { Attribute, AttributeValue } from "../types/attribute.type";

// Attribute services
export const getAllAttributes = async () => {
  try {
    const response = await attributeApi.getAllAttributes();
    // Kiểm tra cấu trúc response từ Laravel API
    if (response.data && response.data.data) {
      return { data: response.data.data };
    } else if (Array.isArray(response.data)) {
      return { data: response.data };
    } else {
      return response;
    }
  } catch (error) {
    console.error("Error fetching attributes:", error);
    throw error;
  }
};

export const getAttribute = async (id: number) => {
  try {
    const response = await attributeApi.getAttribute(id);
    // Kiểm tra cấu trúc response từ Laravel API
    if (response.data && response.data.data) {
      return { data: response.data.data };
    } else {
      return response;
    }
  } catch (error) {
    console.error(`Error fetching attribute with id ${id}:`, error);
    throw error;
  }
};

export const createAttribute = async (data: Partial<Attribute>) => {
  try {
    const response = await attributeApi.createAttribute(data);
    return response.data;
  } catch (error) {
    console.error("Error creating attribute:", error);
    throw error;
  }
};

export const updateAttribute = async (id: number, data: Partial<Attribute>) => {
  try {
    const response = await attributeApi.updateAttribute(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating attribute with id ${id}:`, error);
    throw error;
  }
};

export const deleteAttribute = async (id: number) => {
  try {
    const response = await attributeApi.deleteAttribute(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting attribute with id ${id}:`, error);
    throw error;
  }
};

// Attribute Value services
export const getAllAttributeValues = async () => {
  try {
    const response = await attributeApi.getAllAttributeValues();
    // Kiểm tra cấu trúc response từ Laravel API
    if (response.data && response.data.data) {
      return { data: response.data.data };
    } else if (Array.isArray(response.data)) {
      return { data: response.data };
    } else {
      return response;
    }
  } catch (error) {
    console.error("Error fetching attribute values:", error);
    throw error;
  }
};

export const getAttributeValue = async (id: number) => {
  try {
    const response = await attributeApi.getAttributeValue(id);
    // Kiểm tra cấu trúc response từ Laravel API
    if (response.data && response.data.data) {
      return { data: response.data.data };
    } else {
      return response;
    }
  } catch (error) {
    console.error(`Error fetching attribute value with id ${id}:`, error);
    throw error;
  }
};

export const createAttributeValue = async (data: Partial<AttributeValue>) => {
  try {
    const response = await attributeApi.createAttributeValue(data);
    return response.data;
  } catch (error) {
    console.error("Error creating attribute value:", error);
    throw error;
  }
};

export const updateAttributeValue = async (id: number, data: Partial<AttributeValue>) => {
  try {
    const response = await attributeApi.updateAttributeValue(id, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating attribute value with id ${id}:`, error);
    throw error;
  }
};

export const deleteAttributeValue = async (id: number) => {
  try {
    const response = await attributeApi.deleteAttributeValue(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting attribute value with id ${id}:`, error);
    throw error;
  }
};