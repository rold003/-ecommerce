import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService, type AdminUsersFilters } from '@/services/admin.service';

export function useAdminUsers(filters: AdminUsersFilters) {
  return useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => adminService.listUsers(filters),
    placeholderData: (prev) => prev,
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: { activo?: boolean; rol?: 'CLIENTE' | 'ADMIN' } }) =>
      adminService.updateUser(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}
