import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Set up axios interceptor for auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const commentService = {
  // Get all comments for admin
  getAllComments: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/comments`);
    return response.data;
  },

  // Get comments by product
  getCommentsByProduct: async (productId: number) => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}/comments`);
    return response.data;
  },

  // Update comment status
  updateCommentStatus: async (commentId: number, status: 'approved' | 'rejected') => {
    const response = await axios.put(`${API_BASE_URL}/admin/comments/${commentId}/status`, { status });
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId: number) => {
    const response = await axios.delete(`${API_BASE_URL}/admin/comments/${commentId}`);
    return response.data;
  },

  // Get all reviews (same endpoint, filter by rating)
  getAllReviews: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/comments`);
    return response.data;
  },

  // Get reviews by product
  getReviewsByProduct: async (productId: number) => {
    const response = await axios.get(`${API_BASE_URL}/comments?product_id=${productId}`);
    return response.data;
  },

  // Update review status
  updateReviewStatus: async (reviewId: number, status: 'approved' | 'rejected') => {
    const response = await axios.put(`${API_BASE_URL}/admin/comments/${reviewId}/status`, { status });
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId: number) => {
    const response = await axios.delete(`${API_BASE_URL}/admin/comments/${reviewId}`);
    return response.data;
  },

  // Get rating stats
  getRatingStats: async (productId: number) => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}/rating-stats`);
    return response.data;
  },

  // Get all comments and reviews
  getAllCommentsAndReviews: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/comments`);
    return response.data;
  },

  // Get comment/review stats
  getStats: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/comments`);
    const allData = response.data.data || response.data || [];
    
    const comments = allData.filter((item: any) => item.rating === 0);
    const reviews = allData.filter((item: any) => item.rating > 0);
    
    return {
      comments: {
        total: comments.length,
        pending: comments.filter((c: any) => c.status === 'pending').length,
        approved: comments.filter((c: any) => c.status === 'approved').length,
        rejected: comments.filter((c: any) => c.status === 'rejected').length
      },
      reviews: {
        total: reviews.length,
        pending: reviews.filter((r: any) => r.status === 'pending').length,
        approved: reviews.filter((r: any) => r.status === 'approved').length,
        rejected: reviews.filter((r: any) => r.status === 'rejected').length,
        averageRating: reviews.length > 0 ? 
          (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0'
      }
    };
  }
};

export default commentService;