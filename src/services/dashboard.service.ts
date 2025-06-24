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

export const dashboardService = {
  getStats: async () => {
    try {
      const response = await axiosInstance.get("/dashboard/stats");
      const data = parseResponse(response);
      return { data: data.data || {} };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return { data: {} };
    }
  }
};