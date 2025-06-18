export interface OrderProduct {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  total: number;
  status: "pending" | "processing" | "shipping" | "completed" | "cancelled";
  paymentMethod: "cod" | "bank" | "online";
  note?: string;
  createdAt: string;
  updated_at?: string;
}