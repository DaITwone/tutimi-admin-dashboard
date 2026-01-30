import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/app/lib/queryKeys';
import {
  createInventoryAdjust,
  createInventoryIn,
  createInventoryOut,
  fetchInventoryTransactions,
} from '@/app/features/inventory/services/inventoryService';

/* ===================== QUERIES ===================== */
export function useInventoryTransactions(productId: string | null) {
  return useQuery({
    queryKey: queryKeys.inventoryTransactions(productId || ''),
    queryFn: () => fetchInventoryTransactions(productId!),
    enabled: !!productId,
    staleTime: 1000 * 20,
  });
}

/* ===================== INVALIDATE HELPER ===================== */
function invalidateInventoryRelatedQueries(qc: ReturnType<typeof useQueryClient>, productId?: string | null) {
  // ✅ invalidate ALL products queries (match prefix)
  qc.invalidateQueries({ queryKey: ['products'] });

  // ✅ invalidate transactions list for this product
  if (productId) {
    qc.invalidateQueries({
      queryKey: queryKeys.inventoryTransactions(productId),
    });
  }
}

/* ===================== MUTATIONS ===================== */
export function useCreateInventoryIn() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createInventoryIn,
    onSuccess: (_data, variables) => {
      // variables should contain productId
      invalidateInventoryRelatedQueries(qc, variables.productId);
    },
  });
}

export function useCreateInventoryOut() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createInventoryOut,
    onSuccess: (_data, variables) => {
      invalidateInventoryRelatedQueries(qc, variables.productId);
    },
  });
}

export function useCreateInventoryAdjust() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createInventoryAdjust,
    onSuccess: (_data, variables) => {
      invalidateInventoryRelatedQueries(qc, variables.productId);
    },
  });
}
