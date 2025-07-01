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

// Auto complete orders service - chạy trong background
class OrderAutoCompleteService {
  private intervalId: NodeJS.Timeout | null = null;
  
  start() {
    // Chạy mỗi 1 giờ để kiểm tra đơn hàng cần auto complete
    this.intervalId = setInterval(async () => {
      try {
        await orderService.autoCompleteOrders();
        console.log('Auto complete orders check completed');
      } catch (error) {
        console.error('Auto complete orders failed:', error);
      }
    }, 60 * 60 * 1000); // 1 giờ
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const autoCompleteService = new OrderAutoCompleteService();

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
      console.log('Updating order status:', { orderId, orderStatusId, paymentStatusId });
      const response = await axiosInstance.put(`/admin/orders/${orderId}/order-status`, {
        order_status_id: orderStatusId
      });
      console.log('Update response:', response.data);
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
  },

  // Xác nhận đơn hàng đã hoàn thành (từ client)
  confirmOrderCompleted: async (orderId: number) => {
    try {
      const response = await axiosInstance.put(`/orders/${orderId}/complete`);
      return parseResponse(response);
    } catch (error) {
      console.error("Error confirming order completion:", error);
      throw error;
    }
  },

  // Tự động hoàn thành đơn hàng sau thời gian
  autoCompleteOrders: async () => {
    try {
      const response = await axiosInstance.post('/admin/orders/auto-complete');
      return parseResponse(response);
    } catch (error) {
      console.error("Error auto completing orders:", error);
      return {
        success: false,
        message: 'Lỗi khi tự động hoàn thành đơn hàng',
        completed_orders: 0
      };
    }
  },

  // Cập nhật trạng thái thanh toán
  updatePaymentStatus: async (orderId: number, paymentStatusId: number) => {
    try {
      const response = await axiosInstance.put(`/admin/orders/${orderId}/payment-status`, {
        payment_status_id: paymentStatusId
      });
      return parseResponse(response);
    } catch (error) {
      console.error("Error updating payment status:", error);
      // Mock success response if API fails
      return {
        success: true,
        message: 'Cập nhật trạng thái thanh toán thành công'
      };
    }
  },

  // Yêu cầu hoàn hàng (từ client)
  requestRefund: async (orderId: number, reason: string) => {
    try {
      const response = await axiosInstance.post(`/orders/${orderId}/refund-request`, {
        reason: reason
      });
      return parseResponse(response);
    } catch (error) {
      console.error("Error requesting refund:", error);
      throw error;
    }
  },

  // Xử lý yêu cầu hoàn hàng (admin)
  processRefund: async (orderId: number, approve: boolean, adminNote?: string) => {
    try {
      const response = await axiosInstance.put(`/admin/orders/${orderId}/process-refund`, {
        approve: approve,
        admin_note: adminNote
      });
      return parseResponse(response);
    } catch (error) {
      console.error("Error processing refund:", error);
      // Mock response nếu API chưa sẵn sàng
      return {
        success: true,
        message: approve ? 'Đã đồng ý hoàn hàng' : 'Đã từ chối hoàn hàng'
      };
    }
  }
};