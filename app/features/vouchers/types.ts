export type Voucher = {
  code: string;
  title: string;
  description: string | null;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_value: number | null;
  for_new_user: boolean;
  max_usage_per_user: number | null;
  is_active: boolean;
};
