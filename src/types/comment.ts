export interface Comment {
  id: number;
  user_id: number;
  product_id: number;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
  product?: {
    id: number;
    name: string;
  };
}