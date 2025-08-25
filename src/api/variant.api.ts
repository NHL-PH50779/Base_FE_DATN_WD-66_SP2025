import type { Variant } from "../types/variant.type";

let mockVariants: Variant[] = [
  {
    id: 1,
    laptopId: 1,
    name: "Dell XPS 13 - Silver 16GB/512GB",
    price: 36000000,
    color: "Silver",
    ram: "16GB",
    storage: "512GB SSD",
    image: "https://via.placeholder.com/100",
    quantity: 10,
  },
  {
    id: 2,
    laptopId: 1,
    name: "Dell XPS 13 - Black 8GB/256GB",
    price: 32000000,
    color: "Black",
    ram: "8GB",
    storage: "256GB SSD",
    image: "https://via.placeholder.com/100",
    quantity: 5,
  },
];

export const variantApi = {
  getAll: async (): Promise<Variant[]> => Promise.resolve(mockVariants),
  create: async (data: Variant): Promise<void> => {
    mockVariants = [{ ...data, id: Date.now() }, ...mockVariants];
  },
  update: async (id: number, data: Partial<Variant>): Promise<void> => {
    mockVariants = mockVariants.map((v) => (v.id === id ? { ...v, ...data } : v));
  },
  delete: async (id: number): Promise<void> => {
    mockVariants = mockVariants.filter((v) => v.id !== id);
  },
};
