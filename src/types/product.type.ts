export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
  isShow: boolean;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type ProductFormParams = {
  title: string;
  price: number;
  images: string;
  description: string;
  category: string;
  isShow: boolean;
};
export type CartItem = {
  product: Product;
  quantity: number;
};
