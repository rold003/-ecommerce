import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { brandService, type BrandInput } from '@/services/brand.service';

const KEY = ['brands'];

export function useAdminBrands() {
  return useQuery({ queryKey: KEY, queryFn: brandService.list });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BrandInput) => brandService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<BrandInput> }) => brandService.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => brandService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
