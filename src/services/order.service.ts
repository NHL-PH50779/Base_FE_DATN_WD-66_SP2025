import { axiosInstance } from "../utils/axios.util";

const parseResponse = (response: any) => {
  let data;
  if (typeof response.data === 'string') {
    const jsonString = response.data
      .replace(/^\/\/ bootstrap\/app\.php\n/, '')
      .replace(/<<<<<<< HEAD\n/g, '')
      .replace(/=======\n/g, '')
      .replace(/>>>>>>> [^\n]+\n/g, '');
    data = JSON.parse(jsonString);
  } else {
    data = response.data;
  }
  return data;
};

export const orderService = {
  // Admin: Lấy tất cả đơn hàng
  getAllOrders: async () => {
    try {
      const response = await axiosInstance.get("/admin/orders");
      const data = parseResponse(response);
      return { data: Array.isArray(data) ? data : (data.data || []) };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { data: [] };
    }
  },

  // Admin: Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (orderId: number, orderStatusId: number, paymentStatusId: number = 1) => {
    try {
      const response = await axiosInstance.put(`/admin/orders/${orderId}/status`, {
        order_status_id: orderStatusId,
        payment_status_id: paymentStatusId
      });
      return parseResponse(response);
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng (Admin)
  getOrderDetail: async (orderId: number) => {
    try {
      const response = await axiosInstance.get(`/admin/orders/${orderId}`);
      const data = parseResponse(response);
      return { data };
    } catch (error) {
      console.error("Error fetching order detail:", error);
      throw error;
    }
  }
};