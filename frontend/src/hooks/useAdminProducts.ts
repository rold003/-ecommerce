import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService, type ProductFilters, type ProductInput } from '@/services/product.service';

export function useAdminProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['admin-products', filters],
    queryFn: () => productService.listAdmin(filters),
    placeholderData: (prev) => prev,
  });
}

function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    void queryClient.invalidateQueries({ queryKey: ['products'] });
  };
}

export function useCreateProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (input: ProductInput) => productService.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProductInput> }) =>
      productService.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onSuccess: invalidate,
  });
}
