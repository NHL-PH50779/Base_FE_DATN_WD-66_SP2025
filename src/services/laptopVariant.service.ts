import type { LaptopVariantRequest } from "../types/laptopVariant.type";

export const getLaptopVariants = (productId: number) => {
  return axios.get(`${API_URL}/products/${productId}/variants`);
};

export const createLaptopVariant = (
  productId: number,
  variant: LaptopVariantRequest
) => {
  return axios.post(`${API_URL}/products/${productId}/variants`, variant);
};

export const deleteLaptopVariant = (variantId: number) => {
  return axios.delete(`${API_URL}/variants/${variantId}`);
};
