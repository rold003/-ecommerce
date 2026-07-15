import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { cartService } from '@/services/cart.service';
import type { Carrito } from '@/types/cart';

const CART_KEY = ['cart'];

export function useCart() {
  const { usuario } = useAuth();
  return useQuery({
    queryKey: CART_KEY,
    queryFn: cartService.get,
    enabled: Boolean(usuario),
  });
}

function useCartMutation<TVariables>(mutationFn: (variables: TVariables) => Promise<Carrito>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (carrito) => queryClient.setQueryData(CART_KEY, carrito),
  });
}

export function useAddToCart() {
  return useCartMutation(({ productoId, cantidad }: { productoId: string; cantidad?: number }) =>
    cartService.addItem(productoId, cantidad),
  );
}

export function useUpdateCartItem() {
  return useCartMutation(({ productoId, cantidad }: { productoId: string; cantidad: number }) =>
    cartService.updateItem(productoId, cantidad),
  );
}

export function useRemoveCartItem() {
  return useCartMutation((productoId: string) => cartService.removeItem(productoId));
}

export function useClearCart() {
  return useCartMutation<void>(() => cartService.clear());
}

export function useApplyCoupon() {
  return useCartMutation((codigo: string) => cartService.applyCoupon(codigo));
}

export function useRemoveCoupon() {
  return useCartMutation<void>(() => cartService.removeCoupon());
}
