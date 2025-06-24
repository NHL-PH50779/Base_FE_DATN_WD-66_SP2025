interface ProductVariant {
  id?: number;
  product_id: number;
  sku: string;
  price: number;
  stock: number;
  is_active?: boolean;
  color?: string; // Thêm trường màu sắc
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  
  // Relations
  attributeValues?: AttributeValue[];
}

export type { ProductVariant };