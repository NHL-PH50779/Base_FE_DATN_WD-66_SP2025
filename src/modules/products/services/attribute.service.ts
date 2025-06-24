import { attributeApi } from "../api/attribute.api";
import type { Attribute, AttributeValue } from "../types/attribute.type";

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

export const getAllAttributes = async () => {
  try {
    const response = await attributeApi.getAllAttributes();
    const attributes = parseResponse(response);
    
    // Load values cho từng attribute
    const attributesWithValues = await Promise.all(
      attributes.map(async (attribute: Attribute) => {
        try {
          const valuesResponse = await getAllAttributeValues();
          const allValues = valuesResponse.data || [];
          
          // Filter values theo attribute_id
          const attributeValues = allValues.filter((value: AttributeValue) => 
            value.attribute_id === attribute.id
          );
          
          return {
            ...attribute,
            values: attributeValues
          };
        } catch (error) {
          console.error(`Error loading values for attribute ${attribute.id}:`, error);
          return {
            ...attribute,
            values: []
          };
        }
      })
    );
    
    return { data: attributesWithValues };
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return { data: [] };
  }
};

export const getAttribute = async (id: number) => {
  try {
    const response = await attributeApi.getAttribute(id);
    const data = parseResponse(response);
    return { data };
  } catch (error) {
    console.error(`Error fetching attribute with id ${id}:`, error);
    throw error;
  }
};

export const createAttribute = async (data: Partial<Attribute>) => {
  try {
    const response = await attributeApi.createAttribute(data);
    return parseResponse(response);
  } catch (error) {
    console.error("Error creating attribute:", error);
    throw error;
  }
};

export const updateAttribute = async (id: number, data: Partial<Attribute>) => {
  try {
    const response = await attributeApi.updateAttribute(id, data);
    return parseResponse(response);
  } catch (error) {
    console.error(`Error updating attribute with id ${id}:`, error);
    throw error;
  }
};

export const deleteAttribute = async (id: number) => {
  try {
    const response = await attributeApi.deleteAttribute(id);
    return parseResponse(response);
  } catch (error) {
    console.error(`Error deleting attribute with id ${id}:`, error);
    throw error;
  }
};

export const getAllAttributeValues = async () => {
  try {
    const response = await attributeApi.getAllAttributeValues();
    const data = parseResponse(response);
    return { data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("Error fetching attribute values:", error);
    return { data: [] };
  }
};

export const getAttributeValue = async (id: number) => {
  try {
    const response = await attributeApi.getAttributeValue(id);
    const data = parseResponse(response);
    return { data };
  } catch (error) {
    console.error(`Error fetching attribute value with id ${id}:`, error);
    throw error;
  }
};

export const createAttributeValue = async (data: Partial<AttributeValue>) => {
  try {
    const response = await attributeApi.createAttributeValue(data);
    return parseResponse(response);
  } catch (error) {
    console.error("Error creating attribute value:", error);
    throw error;
  }
};

export const updateAttributeValue = async (id: number, data: Partial<AttributeValue>) => {
  try {
    const response = await attributeApi.updateAttributeValue(id, data);
    return parseResponse(response);
  } catch (error) {
    console.error(`Error updating attribute value with id ${id}:`, error);
    throw error;
  }
};

export const deleteAttributeValue = async (id: number) => {
  try {
    const response = await attributeApi.deleteAttributeValue(id);
    return parseResponse(response);
  } catch (error) {
    console.error(`Error deleting attribute value with id ${id}:`, error);
    throw error;
  }
};