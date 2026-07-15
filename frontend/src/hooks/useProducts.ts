import { useQuery } from '@tanstack/react-query';
import { productService, type ProductFilters } from '@/services/product.service';

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.list(filters),
    placeholderData: (prev) => prev,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug),
    enabled: Boolean(slug),
  });
}
