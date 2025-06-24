export interface LaptopVariantRequest {
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

export interface LaptopVariant extends LaptopVariantRequest {
  id: number;
}