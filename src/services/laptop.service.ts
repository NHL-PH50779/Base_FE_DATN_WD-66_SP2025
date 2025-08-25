import axios from "axios";
import type { Laptop } from "../types/laptop.type";

const API_URL = "http://localhost:8000/api";

export const getAllLaptops = (page = 1, perPage = 15) => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/admin/products?page=${page}&per_page=${perPage}&t=${Date.now()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
    timeout: 10000
  });
};

export const getLaptopById = (id: number) => {
  return axios.get(`${API_URL}/admin/products/${id}`);
};

export const searchLaptops = (keyword: string) => {
  return axios.get(`${API_URL}/products/search?keyword=${keyword}`);
};

export const createLaptop = (data: Partial<Laptop>) => {
  const token = localStorage.getItem('token');
  console.log('Creating product:', data);
  
  return axios.post(`${API_URL}/admin/products`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 15000
  });
};

export const updateLaptop = (id: number, data: Partial<Laptop>) => {
  const token = localStorage.getItem('token');
  console.log('Updating product:', id, data);
  
  return axios.put(`${API_URL}/admin/products/${id}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 10000
  });
};

export const deleteLaptop = (id: number) => {
  const token = localStorage.getItem('token');
  console.log('Deleting product with token:', token ? 'Present' : 'Missing');
  
  return axios.delete(`${API_URL}/admin/products/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 10000
  });
};

export const getTrashedLaptops = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/admin/products/trashed`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const restoreLaptop = (id: number) => {
  const token = localStorage.getItem('token');
  return axios.put(`${API_URL}/admin/products/restore/${id}`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const toggleActiveLaptop = (id: number) => {
  const token = localStorage.getItem('token');
  return axios.put(`${API_URL}/admin/products/toggle-active/${id}`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const forceDeleteLaptop = (id: number) => {
  const token = localStorage.getItem('token');
  return axios.delete(`${API_URL}/admin/products/force-delete/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};