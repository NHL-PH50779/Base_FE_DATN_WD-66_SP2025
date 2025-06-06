import type { Order } from "../types/order.type";

const mockOrders: Order[] = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    phone: "0123456789",
    address: "Hà Nội",
    total: 25000000,
    status: "pending",
    createdAt: "2025-05-01",
  },
  {
    id: 2,
    customerName: "Trần Thị B",
    phone: "0987654321",
    address: "TP. HCM",
    total: 35000000,
    status: "completed",
    createdAt: "2025-05-02",
  },
];

export const orderApi = {
  getAll: async (): Promise<Order[]> => Promise.resolve(mockOrders),
  update: async (id: number, data: Partial<Order>): Promise<void> => {
    console.log("Update order:", id, data);
  },
  delete: async (id: number): Promise<void> => {
    console.log("Delete order:", id);
  },
};
