import axios from "axios";
import type { Laptop } from "../types/laptop.type";

const API_URL = "http://localhost:8000/api";

export const getAllLaptops = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/admin/products`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getLaptopById = (id: number) => {
  return axios.get(`${API_URL}/admin/products/${id}`);
};

export const searchLaptops = (keyword: string) => {
  return axios.get(`${API_URL}/products/search?keyword=${keyword}`);
};

export const createLaptop = (data: Partial<Laptop>) => {
  return axios.post(`${API_URL}/admin/products`, data);
};

export const updateLaptop = (id: number, data: Partial<Laptop>) => {
  return axios.put(`${API_URL}/admin/products/${id}`, data);
};

export const deleteLaptop = (id: number) => {
  return axios.delete(`${API_URL}/admin/products/${id}`);
};

export const getTrashedLaptops = () => {
  const token = localStorage.getItem('token');
  console.log('Token for trashed:', token);
  return axios.get(`${API_URL}/admin/products/trashed`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
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