export interface Order {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
}
