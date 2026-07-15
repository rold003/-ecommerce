import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminService.getDashboard,
    staleTime: 60_000,
  });
}

export function useAdminSalesReport(desde: string, hasta: string) {
  return useQuery({
    queryKey: ['admin-sales-report', desde, hasta],
    queryFn: () => adminService.getSalesReport(desde, hasta),
    enabled: Boolean(desde) && Boolean(hasta),
  });
}
