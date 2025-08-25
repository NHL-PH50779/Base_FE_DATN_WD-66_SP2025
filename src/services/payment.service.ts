import { axiosInstance } from '../utils/axios.util';

export interface VnpayUrlRequest {
  orderId: number;
  amount: number;
}

export interface VnpayCallbackRequest {
  [key: string]: string;
}

export const paymentService = {
  createVnpayUrl: async (data: VnpayUrlRequest) => {
    const response = await axiosInstance.post('/payment/create-vnpay-url', data);
    return response.data;
  },

  vnpayCallback: async (params: VnpayCallbackRequest) => {
    const response = await axiosInstance.post('/payment/vnpay-callback', params);
    return response.data;
  }
};