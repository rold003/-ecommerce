import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useAdminOrders';
import type { EstadoPedido, PedidoAdmin } from '@/types/order';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/getErrorMessage';

const ESTADOS: EstadoPedido[] = ['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

const ESTADO_LABELS: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  PAGADO: 'Pagado',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

const ESTADO_VARIANTS: Record<EstadoPedido, 'neutral' | 'success' | 'warning' | 'danger' | 'info'> = {
  PENDIENTE: 'warning',
  PAGADO: 'info',
  ENVIADO: 'info',
  ENTREGADO: 'success',
  CANCELADO: 'danger',
};

const ALLOWED_NEXT: Record<EstadoPedido, EstadoPedido[]> = {
  PENDIENTE: ['PAGADO', 'CANCELADO'],
  PAGADO: ['ENVIADO', 'CANCELADO'],
  ENVIADO: ['ENTREGADO'],
  ENTREGADO: [],
  CANCELADO: [],
};

export default function OrdersAdmin() {
  const [page, setPage] = useState(1);
  const [estado, setEstado] = useState('');
  const { data, isLoading } = useAdminOrders({ page, estado: estado || undefined });
  const updateStatus = useUpdateOrderStatus();
  const toast = useToast();

  const [editing, setEditing] = useState<PedidoAdmin | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoPedido | ''>('');
  const [tracking, setTracking] = useState('');

  const openModal = (pedido: PedidoAdmin): void => {
    setEditing(pedido);
    setNuevoEstado('');
    setTracking(pedido.numeroSeguimiento ?? '');
  };

  const handleUpdate = async (): Promise<void> => {
    if (!editing || !nuevoEstado) return;
    try {
      await updateStatus.mutateAsync({
        id: editing.id,
        input: { estado: nuevoEstado, numeroSeguimiento: tracking || undefined },
      });
      toast.success('Estado actualizado');
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <Select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-48">
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {ESTADO_LABELS[e]}
            </option>
          ))}
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
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data?.items.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800">
                  <td className="px-4 py-3">
                    <Link to={`/pedidos/${p.id}`} className="font-medium hover:underline">
                      {p.numero}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                    {p.usuario.nombre} {p.usuario.apellido}
                  </td>
                  <td className="px-4 py-3">{formatPrice(p.total)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={ESTADO_VARIANTS[p.estado]}>{ESTADO_LABELS[p.estado]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal(p)}
                      disabled={ALLOWED_NEXT[p.estado].length === 0}
                    >
                      Cambiar estado
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.meta.totalPages > 1 && (
        <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={`Actualizar pedido ${editing?.numero ?? ''}`}
      >
        {editing && (
          <div className="flex flex-col gap-4">
            <Select
              label="Nuevo estado"
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value as EstadoPedido)}
            >
              <option value="">Selecciona...</option>
              {ALLOWED_NEXT[editing.estado].map((e) => (
                <option key={e} value={e}>
                  {ESTADO_LABELS[e]}
                </option>
              ))}
            </Select>
            {nuevoEstado === 'ENVIADO' && (
              <Input
                label="Número de seguimiento (opcional)"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
              />
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate} loading={updateStatus.isPending} disabled={!nuevoEstado}>
                Guardar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
