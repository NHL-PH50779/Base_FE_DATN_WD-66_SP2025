import type { Laptop } from "../types/product";

const mockLaptops: Laptop[] = [
  {
    id: 1,
    name: "Laptop Dell XPS 13",
    price: 35000000,
    brand: "Dell",
    category: "Ultrabook",
    cpu: "Intel Core i7",
    ram: "16GB",
    storage: "512GB SSD",
    screen: "13.3 inch Full HD",
    card: "Intel Iris Xe",
    os: "Windows 11",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "MacBook Pro 14 M1",
    price: 52000000,
    brand: "Apple",
    category: "Ultrabook",
    cpu: "Apple M1 Pro",
    ram: "16GB",
    storage: "1TB SSD",
    screen: "14 inch Retina",
    card: "Apple GPU",
    os: "macOS",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "HP Omen 16",
    price: 30000000,
    brand: "HP",
    category: "Gaming",
    cpu: "Intel Core i7",
    ram: "16GB",
    storage: "1TB SSD",
    screen: "16.1 inch 144Hz",
    card: "NVIDIA RTX 3060",
    os: "Windows 11",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Asus ROG Strix G15",
    price: 28000000,
    brand: "Asus",
    category: "Gaming",
    cpu: "AMD Ryzen 7",
    ram: "16GB",
    storage: "512GB SSD",
    screen: "15.6 inch 144Hz",
    card: "NVIDIA RTX 3050",
    os: "Windows 11",
    image: "https://via.placeholder.com/150",
  },
  {
    id: 5,
    name: "Acer Swift 3",
    price: 18000000,
    brand: "Acer",
    category: "Ultrabook",
    cpu: "Intel Core i5",
    ram: "8GB",
    storage: "512GB SSD",
    screen: "14 inch Full HD",
    card: "Intel Iris Xe",
    os: "Windows 11",
    image: "https://via.placeholder.com/150",
  },
];

export const laptopApi = {
  getAll: async (): Promise<Laptop[]> => {
    return Promise.resolve(mockLaptops);
  },
  create: async (data: Laptop): Promise<void> => {
    console.log("Create laptop:", data);
  },
  update: async (id: number, data: Laptop): Promise<void> => {
    console.log("Update laptop:", id, data);
  },
  delete: async (id: number): Promise<void> => {
    console.log("Delete laptop:", id);
  },
};
