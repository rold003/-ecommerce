import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';

export function useProductAutocomplete(query: string) {
  return useQuery({
    queryKey: ['products-autocomplete', query],
    queryFn: () => productService.autocomplete(query),
    enabled: query.trim().length >= 2,
  });
}
