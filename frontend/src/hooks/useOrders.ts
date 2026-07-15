import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getById(id),
    enabled: Boolean(id),
  });
}

export function useMyOrders(params?: { estado?: string; page?: number }) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderService.listMine(params),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderService.cancel(id),
    onSuccess: (pedido) => {
      queryClient.setQueryData(['order', pedido.id], pedido);
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
