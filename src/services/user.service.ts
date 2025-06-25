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

export const userService = {
  getAllUsers: async () => {
    try {
      // Thêm timestamp để tránh cache
      const timestamp = new Date().getTime();
      const response = await axiosInstance.get(`/admin/users?t=${timestamp}`);
      const data = parseResponse(response);
      return { data: Array.isArray(data) ? data : (data.data || []) };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { data: [] };
    }
  },

  getUserById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/admin/users/${id}`);
      const data = parseResponse(response);
      return { data };
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  createUser: async (userData: { name: string; email: string; password: string; role: string }) => {
    try {
      const response = await axiosInstance.post("/admin/users", userData);
      return parseResponse(response);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  updateUser: async (id: number, userData: { name: string; email: string; password?: string; role?: string }) => {
    try {
      const response = await axiosInstance.put(`/admin/users/${id}`, userData);
      return parseResponse(response);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  deleteUser: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/admin/users/${id}`);
      return parseResponse(response);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
};