export interface OrderProduct {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export type OrderStatus =
  | "pending"        // Chờ xử lý
  | "processing"     // Đã xác nhận
  | "shipping"       // Đang giao hàng
  | "completed"      // Hoàn thành
  | "cancelled";     // Đã hủy

export type PaymentMethod = "cod" | "bank" | "online";

export interface Order {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  note?: string;
  createdAt: string;
}
