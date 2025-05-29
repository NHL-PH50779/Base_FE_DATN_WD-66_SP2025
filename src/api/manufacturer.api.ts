import type { Manufacturer } from "../types/manufacturer.type";

const mockManufacturers: Manufacturer[] = [
  { id: 1, name: "Dell", country: "USA" },
  { id: 2, name: "Asus", country: "Taiwan" },
  { id: 3, name: "Lenovo", country: "China" },
];

export const manufacturerApi = {
  getAll: async (): Promise<Manufacturer[]> => Promise.resolve(mockManufacturers),
  create: async (data: Manufacturer): Promise<void> => {
    console.log("Create manufacturer:", data);
  },
  update: async (id: number, data: Manufacturer): Promise<void> => {
    console.log("Update manufacturer:", id, data);
  },
  delete: async (id: number): Promise<void> => {
    console.log("Delete manufacturer:", id);
  },
};
