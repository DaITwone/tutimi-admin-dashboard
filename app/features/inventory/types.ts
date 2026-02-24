export type Category = {
  id: string;
  title: string;
};

export type SortKey = "name" | "stock";
export type SortOrder = "asc" | "desc";

export type Product = {
  id: string;
  name: string;
  stock_quantity: number | null;
  image: string | null;
  measure_unit: string | null;
};
