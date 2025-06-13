export interface LaptopVariant {
  id?: number;
  sku: string;
  price: number;
  stock: number;
  attributeValues: {
    id: number;
    value: string;
    attribute: {
      id: number;
      name: string;
    };
  }[];
}

export interface Laptop {
  id?: number;
  name: string;
  description?: string;
  brand_id: number;
  category_id: number;
  thumbnail?: string;
  is_active: boolean;
  variants?: LaptopVariant[];
}