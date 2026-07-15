import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { Pagination } from '@/components/ui/Pagination';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useAdminUsers, useUpdateAdminUser } from '@/hooks/useAdminUsers';
import { getErrorMessage } from '@/utils/getErrorMessage';

export default function Users() {
  const { usuario: current } = useAuth();
  const [page, setPage] = useState(1);
  const [rol, setRol] = useState<'' | 'CLIENTE' | 'ADMIN'>('');
  const { data, isLoading } = useAdminUsers({ page, limit: 10, rol: rol || undefined });
  const updateUser = useUpdateAdminUser();
  const toast = useToast();

  const handleToggleActive = async (id: string, activo: boolean): Promise<void> => {
    try {
      await updateUser.mutateAsync({ id, input: { activo } });
      toast.success(activo ? 'Usuario activado' : 'Usuario desactivado');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleChangeRole = async (id: string, newRol: 'CLIENTE' | 'ADMIN'): Promise<void> => {
    try {
      await updateUser.mutateAsync({ id, input: { rol: newRol } });
      toast.success('Rol actualizado');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Select value={rol} onChange={(e) => setRol(e.target.value as '' | 'CLIENTE' | 'ADMIN')} className="w-48">
          <option value="">Todos los roles</option>
          <option value="CLIENTE">Clientes</option>
          <option value="ADMIN">Administradores</option>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner className="h-8 w-8 text-neutral-400" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data?.items.map((u) => {
                const isSelf = u.id === current?.id;
                return (
                  <tr key={u.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800">
                    <td className="px-4 py-3 font-medium">
                      {u.nombre} {u.apellido}
                    </td>
                    <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <Select
                        value={u.rol}
                        disabled={isSelf}
                        onChange={(e) => handleChangeRole(u.id, e.target.value as 'CLIENTE' | 'ADMIN')}
                        className="w-32"
                      >
                        <option value="CLIENTE">Cliente</option>
                        <option value="ADMIN">Admin</option>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.activo ? 'success' : 'danger'}>{u.activo ? 'Activo' : 'Inactivo'}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={isSelf}
                        onClick={() => handleToggleActive(u.id, !u.activo)}
                        className="text-xs font-medium text-neutral-500 hover:text-neutral-900 disabled:opacity-30 dark:text-neutral-400 dark:hover:text-white"
                      >
                        {u.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {data && data.meta.totalPages > 1 && (
        <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
