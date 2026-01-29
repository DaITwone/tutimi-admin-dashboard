export const queryKeys = {
  categories: () => ['categories'] as const,

  products: (params: {
    categoryId: string;
    search: string;
    manageMode: boolean;
    statusFilter: 'all' | 'on' | 'off';
  }) => ['products', params] as const,

  inventoryTransactions: (productId: string) => ['inventoryTransactions', productId] as const,
};
