export const queryKeys = {
  // cache Danh sách categories
  categories: () => ['categories'] as const,

  // cache Danh sách the filter
  products: (params: {
    categoryId: string;
    search: string;
    manageMode: boolean;
    statusFilter: 'all' | 'on' | 'off';
  }) => ['products', params] as const,

  // cache Lịch sử tồn kho của sản phẩm
  inventoryTransactions: (productId: string) => ['inventoryTransactions', productId] as const,
};
