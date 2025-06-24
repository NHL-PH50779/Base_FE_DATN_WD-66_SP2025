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

export const cartService = {
  // Admin: Lấy tất cả giỏ hàng
  getAllCarts: async () => {
    try {
      const response = await axiosInstance.get("/admin/carts");
      const data = parseResponse(response);
      return { data: Array.isArray(data) ? data : (data.data || []) };
    } catch (error) {
      console.error("Error fetching carts:", error);
      return { data: [] };
    }
  },

  // Admin: Lấy chi tiết giỏ hàng của user
  getCartByUserId: async (userId: number) => {
    try {
      const response = await axiosInstance.get(`/admin/carts/${userId}`);
      const data = parseResponse(response);
      return { data };
    } catch (error) {
      console.error("Error fetching cart detail:", error);
      throw error;
    }
  },

  // Client: Lấy giỏ hàng của user hiện tại
  getMyCart: async () => {
    try {
      const response = await axiosInstance.get("/cart");
      const data = parseResponse(response);
      return { data: data.data || data };
    } catch (error) {
      console.error("Error fetching my cart:", error);
      return { data: { items: [], total: 0 } };
    }
  },

  // Client: Thêm vào giỏ hàng
  addToCart: async (productId: number, productVariantId: number | null, quantity: number) => {
    try {
      const response = await axiosInstance.post("/cart", {
        product_id: productId,
        product_variant_id: productVariantId,
        quantity
      });
      return parseResponse(response);
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  // Client: Cập nhật số lượng
  updateCartItem: async (cartItemId: number, quantity: number) => {
    try {
      const response = await axiosInstance.put(`/cart/${cartItemId}`, {
        quantity
      });
      return parseResponse(response);
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  // Client: Xóa khỏi giỏ hàng
  removeFromCart: async (cartItemId: number) => {
    try {
      const response = await axiosInstance.delete(`/cart/${cartItemId}`);
      return parseResponse(response);
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  }
};