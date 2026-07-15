import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';

export function useAdminOrders(params?: { estado?: string; page?: number }) {
  return useQuery({
    queryKey: ['admin-orders', params],
    queryFn: () => orderService.listAdmin(params),
    placeholderData: (prev) => prev,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: { estado: string; numeroSeguimiento?: string } }) =>
      orderService.updateStatus(id, input),
    onSuccess: (pedido) => {
      queryClient.setQueryData(['order', pedido.id], pedido);
      void queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
}
