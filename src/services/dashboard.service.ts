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
  getStats: async (filters?: any) => {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null) {
            params.append(key, filters[key]);
          }
        });
      }
      
      const url = `/test/dashboard-stats${params.toString() ? '?' + params.toString() : ''}`;
      console.log('Dashboard API URL:', url);
      
      const response = await axiosInstance.get(url);
      const data = parseResponse(response);
      console.log('Dashboard response data:', data);
      
      // API trả về { message, period, data }, chúng ta cần data.data
      if (data && data.data) {
        return { data: data.data };
      }
      
      return { data: {} };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return { data: {} };
    }
  }
};