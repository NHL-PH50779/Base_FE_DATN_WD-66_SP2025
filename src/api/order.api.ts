import type { Order } from "../types/order.type";

let mockOrders: Order[] = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    email: "a@gmail.com",
    phone: "0123456789",
    address: "Hà Nội",
    products: [
      {
        id: 1,
        name: "Laptop Dell XPS 13",
        quantity: 1,
        price: 35000000,
        image: "https://via.placeholder.com/150",
      },
    ],
    total: 35000000,
    status: "pending",
    paymentMethod: "cod",
    note: "Giao giờ hành chính",
    createdAt: "2025-05-01",
  },
  {
    id: 2,
    customerName: "Trần Thị B",
    email: "b@gmail.com",
    phone: "0987654321",
    address: "TP. HCM",
    products: [
      {
        id: 2,
        name: "MacBook Pro 14 M1",
        quantity: 1,
        price: 52000000,
        image: "https://via.placeholder.com/150",
      },
      {
        id: 3,
        name: "HP Omen 16",
        quantity: 2,
        price: 30000000,
        image: "https://via.placeholder.com/150",
      },
    ],
    total: 112000000,
    status: "completed",
    paymentMethod: "bank",
    createdAt: "2025-05-02",
  },
];

export const orderApi = {
  getAll: async (): Promise<Order[]> => Promise.resolve(mockOrders),
  create: async (order: Order): Promise<void> => {
    mockOrders = [
      { ...order, id: Date.now(), createdAt: new Date().toISOString() },
      ...mockOrders,
    ];
    console.log("Create order:", order);
  },
  update: async (id: number, data: Partial<Order>): Promise<void> => {
    mockOrders = mockOrders.map((o) => (o.id === id ? { ...o, ...data } : o));
    console.log("Update order:", id, data);
  },
  delete: async (id: number): Promise<void> => {
    mockOrders = mockOrders.filter((o) => o.id !== id);
    console.log("Delete order:", id);
  },
};
