import axios from "axios";
import type { Laptop } from "../types/laptop.type";

const API_URL = "http://localhost:8000/api";

export const getAllLaptops = () => {
  return axios.get(`${API_URL}/products`);
};

export const getLaptopById = (id: number) => {
  return axios.get(`${API_URL}/products/${id}`);
};

export const searchLaptops = (keyword: string) => {
  return axios.get(`${API_URL}/products/search?keyword=${keyword}`);
};

export const createLaptop = (data: Partial<Laptop>) => {
  return axios.post(`${API_URL}/products`, data);
};

export const updateLaptop = (id: number, data: Partial<Laptop>) => {
  return axios.put(`${API_URL}/products/${id}`, data);
};

export const deleteLaptop = (id: number) => {
  return axios.delete(`${API_URL}/products/${id}`);
};

export const getTrashedLaptops = () => {
  return axios.get(`${API_URL}/products/trashed`);
};

export const restoreLaptop = (id: number) => {
  return axios.put(`${API_URL}/products/restore/${id}`);
};

export const toggleActiveLaptop = (id: number) => {
  return axios.put(`${API_URL}/products/toggle-active/${id}`);
};