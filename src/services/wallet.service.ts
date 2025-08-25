import { axiosInstance } from "../utils/axios.util";

export const walletService = {
  // Lấy danh sách yêu cầu rút tiền (Admin)
  getWithdrawRequests: async () => {
    try {
      const response = await axiosInstance.get('/admin/withdraw-requests');
      return response.data;
    } catch (error) {
      console.error('Error fetching withdraw requests:', error);
      
      // Nếu lỗi 500 hoặc 401, thử gọi API khác
      if (error.response?.status === 500 || error.response?.status === 401) {
        try {
          console.log('Trying fallback API...');
          const fallbackResponse = await axiosInstance.get('/withdraw-requests');
          return fallbackResponse.data;
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          // Trả về dữ liệu rỗng thay vì throw error
          return {
            message: 'Không thể tải danh sách yêu cầu rút tiền',
            data: []
          };
        }
      }
      
      // Trả về dữ liệu rỗng cho các lỗi khác
      return {
        message: 'Không thể tải danh sách yêu cầu rút tiền',
        data: []
      };
    }
  },

  // Duyệt yêu cầu rút tiền
  approveWithdrawRequest: async (id: number) => {
    try {
      const response = await axiosInstance.post(`/admin/withdraw-requests/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving withdraw request:', error);
      throw error;
    }
  },

  // Từ chối yêu cầu rút tiền
  rejectWithdrawRequest: async (id: number, adminNote?: string) => {
    try {
      const response = await axiosInstance.post(`/admin/withdraw-requests/${id}/reject`, {
        admin_note: adminNote
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting withdraw request:', error);
      throw error;
    }
  },

  // Lấy danh sách yêu cầu hoàn hàng (Admin)
  getReturnRequests: async () => {
    try {
      const response = await axiosInstance.get('/admin/return-requests');
      return response.data;
    } catch (error) {
      console.error('Error fetching return requests:', error);
      throw error;
    }
  },

  // Duyệt yêu cầu hoàn hàng
  approveReturnRequest: async (id: number) => {
    try {
      const response = await axiosInstance.post(`/admin/return-requests/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving return request:', error);
      throw error;
    }
  },

  // Từ chối yêu cầu hoàn hàng
  rejectReturnRequest: async (id: number, adminNote?: string) => {
    try {
      const response = await axiosInstance.post(`/admin/return-requests/${id}/reject`, {
        admin_note: adminNote
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting return request:', error);
      throw error;
    }
  },

  // Lấy chi tiết yêu cầu rút tiền
  getWithdrawRequestDetail: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/admin/withdraw-requests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching withdraw request detail:', error);
      throw error;
    }
  },

  // Lấy chi tiết yêu cầu hoàn hàng
  getReturnRequestDetail: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/admin/return-requests/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching return request detail:', error);
      throw error;
    }
  }
};