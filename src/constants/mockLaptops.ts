import type { Laptop } from "../types/laptop.type";

export const mockLaptops: Laptop[] = [
  {
    id: 1,
    name: "MacBook Pro 16 M3",
    brand: "Apple",
    price: 5999,
    stock: 15,
    category: "High-end",
    image_url: "https://via.placeholder.com/120x80?text=MacBook",
  },
  {
    id: 2,
    name: "Dell XPS 13",
    brand: "Dell",
    price: 1999,
    stock: 10,
    category: "Ultrabook",
    image_url: "https://via.placeholder.com/120x80?text=Dell+XPS",
  },
  {
    id: 3,
    name: "Asus ROG Strix",
    brand: "Asus",
    price: 2299,
    stock: 7,
    category: "Gaming",
    image_url: "https://via.placeholder.com/120x80?text=ROG+Strix",
  },
  {
    id: 4,
    name: "HP Spectre x360",
    brand: "HP",
    price: 1899,
    stock: 12,
    category: "Convertible",
    image_url: "https://via.placeholder.com/120x80?text=Spectre",
  },
  {
    id: 5,
    name: "Lenovo ThinkPad X1",
    brand: "Lenovo",
    price: 1799,
    stock: 8,
    category: "Business",
    image_url: "https://via.placeholder.com/120x80?text=ThinkPad",
  },
];
