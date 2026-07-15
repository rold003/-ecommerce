import { Package } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { useMyOrders } from '@/hooks/useOrders';
import { formatPrice } from '@/utils/formatPrice';

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  PAGADO: 'Pagado',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

const ESTADO_VARIANTS: Record<string, 'neutral' | 'success' | 'warning' | 'danger' | 'info'> = {
  PENDIENTE: 'warning',
  PAGADO: 'info',
  ENVIADO: 'info',
  ENTREGADO: 'success',
  CANCELADO: 'danger',
};

export default function Orders() {
  const [estado, setEstado] = useState('');
  const { data, isLoading } = useMyOrders({ estado: estado || undefined });

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis pedidos</h1>
        <Select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-48">
          <option value="">Todos</option>
          {Object.entries(ESTADO_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      {!data || data.items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aún no tienes pedidos"
          description="Cuando realices una compra aparecerá aquí."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {data.items.map((pedido) => (
            <Link
              key={pedido.id}
              to={`/pedidos/${pedido.id}`}
              className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4 hover:shadow-md dark:border-neutral-800"
            >
              <div>
                <p className="font-medium">{pedido.numero}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {new Date(pedido.createdAt).toLocaleDateString('es-EC', { dateStyle: 'medium' })} ·{' '}
                  {pedido.items.length} producto(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">{formatPrice(pedido.total)}</span>
                <Badge variant={ESTADO_VARIANTS[pedido.estado]}>{ESTADO_LABELS[pedido.estado]}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
