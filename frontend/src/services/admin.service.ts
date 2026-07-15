import type { AdminUsuario, DashboardData, SalesReport } from '@/types/admin';
import type { PaginationMeta } from '@/types/product';
import { api } from './api';

export interface AdminUsersFilters {
  rol?: 'CLIENTE' | 'ADMIN';
  q?: string;
  page?: number;
  limit?: number;
}

export const adminService = {
  async getDashboard(): Promise<DashboardData> {
    const { data } = await api.get<{ status: string; data: DashboardData }>('/admin/dashboard');
    return data.data;
  },

  async getSalesReport(desde: string, hasta: string): Promise<SalesReport> {
    const { data } = await api.get<{ status: string; data: SalesReport }>('/admin/reports/sales', {
      params: { desde, hasta },
    });
    return data.data;
  },

  async listUsers(filters: AdminUsersFilters): Promise<{ items: AdminUsuario[]; meta: PaginationMeta }> {
    const { data } = await api.get<{ status: string; data: AdminUsuario[]; meta: PaginationMeta }>(
      '/admin/users',
      { params: filters },
    );
    return { items: data.data, meta: data.meta };
  },

  async updateUser(id: string, input: { activo?: boolean; rol?: 'CLIENTE' | 'ADMIN' }): Promise<AdminUsuario> {
    const { data } = await api.patch<{ status: string; data: { usuario: AdminUsuario } }>(
      `/admin/users/${id}`,
      input,
    );
    return data.data.usuario;
  },
};
