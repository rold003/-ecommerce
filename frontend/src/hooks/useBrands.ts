import { useQuery } from '@tanstack/react-query';
import { brandService } from '@/services/brand.service';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: brandService.list,
    staleTime: 5 * 60_000,
  });
}
