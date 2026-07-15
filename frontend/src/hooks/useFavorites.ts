import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { favoriteService } from '@/services/favorite.service';

const FAVORITES_KEY = ['favorites'];

export function useFavorites() {
  const { usuario } = useAuth();
  return useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: favoriteService.list,
    enabled: Boolean(usuario),
  });
}

export function useIsFavorite(productoId: string): boolean {
  const { data: favoritos } = useFavorites();
  return Boolean(favoritos?.some((f) => f.productoId === productoId));
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productoId: string) => favoriteService.add(productoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAVORITES_KEY }),
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productoId: string) => favoriteService.remove(productoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAVORITES_KEY }),
  });
}
