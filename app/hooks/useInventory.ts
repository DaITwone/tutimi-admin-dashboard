import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/app/lib/queryKeys';
import {
  createInventoryAdjust,
  createInventoryIn,
  createInventoryOut,
  fetchInventoryTransactions,
  InventoryDirection,
} from '@/app/lib/inventoryService';

export function useInventoryTransactions(productId: string | null) {
  return useQuery({
    queryKey: queryKeys.inventoryTransactions(productId || ''),
    queryFn: () => fetchInventoryTransactions(productId!),
    enabled: !!productId,
    staleTime: 1000 * 20,
  });
}

export function useCreateInventoryIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createInventoryIn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useCreateInventoryOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createInventoryOut,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useCreateInventoryAdjust() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createInventoryAdjust,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
