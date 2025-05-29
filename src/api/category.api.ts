import type { Category } from "../types/category.type";

const mockCategories: Category[] = [
  { id: 1, name: "Gaming", description: "Laptop chơi game cấu hình cao" },
  { id: 2, name: "Ultrabook", description: "Laptop mỏng nhẹ, pin lâu" },
  { id: 3, name: "Workstation", description: "Laptop cho dân kỹ thuật, thiết kế" },
];

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    return Promise.resolve(mockCategories);
  },
  create: async (data: Category): Promise<void> => {
    console.log("Create category:", data);
  },
  update: async (id: number, data: Category): Promise<void> => {
    console.log("Update category:", id, data);
  },
  delete: async (id: number): Promise<void> => {
    console.log("Delete category:", id);
  },
};
