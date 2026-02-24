export type Product = {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  stats: string | null;
  is_best_seller: boolean;
  image: string | null;
  is_active: boolean | null;
};

export type Category = {
  id: string;
  title: string;
};

export type StatusFilter = 'all' | 'on' | 'off';
