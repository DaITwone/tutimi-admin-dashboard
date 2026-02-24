export type ImageType = 'upload' | 'link';

export type CreateProductInput = {
  name: string;
  price: number;
  salePrice: number | null;
  stats: string;
  isBestSeller: boolean;
};
