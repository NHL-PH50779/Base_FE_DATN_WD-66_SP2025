// Định nghĩa các interface cần thiết trực tiếp trong file
interface BrandSimple {
  id?: number;
  name: string;
  logo?: string;
}

interface CategorySimple {
  id?: number;
  name: string;
  description?: string;
}

interface ProductVariantSimple {
  id?: number;
  product_id: number;
  sku: string;
  price: number;
  stock: number;
  is_active?: boolean;
}

export interface Product {
  id?: number;
  name: string;
  description?: string;
  brand_id: number;
  category_id: number;
  thumbnail?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  
  // Relations
  brand?: BrandSimple;
  category?: CategorySimple;
  variants?: ProductVariantSimple[];
}