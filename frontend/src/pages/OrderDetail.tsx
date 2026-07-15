import { CheckCircle2, Clock, Package, Truck, XCircle, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import { useCancelOrder, useOrder } from '@/hooks/useOrders';
import type { EstadoPedido } from '@/types/order';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/getErrorMessage';

const CANCELABLE_STATES: EstadoPedido[] = ['PENDIENTE', 'PAGADO'];

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const ESTADO_CONFIG: Record<EstadoPedido, { label: string; variant: BadgeVariant; icon: LucideIcon }> = {
  PENDIENTE: { label: 'Pendiente', variant: 'warning', icon: Clock },
  PAGADO: { label: 'Pagado', variant: 'info', icon: CheckCircle2 },
  ENVIADO: { label: 'Enviado', variant: 'info', icon: Truck },
  ENTREGADO: { label: 'Entregado', variant: 'success', icon: Package },
  CANCELADO: { label: 'Cancelado', variant: 'danger', icon: XCircle },
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: pedido, isLoading } = useOrder(id ?? '');
  const cancelOrder = useCancelOrder();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const toast = useToast();

  const handleCancel = async (): Promise<void> => {
    if (!id) return;
    try {
      await cancelOrder.mutateAsync(id);
      toast.success('Pedido cancelado');
      setShowCancelDialog(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-neutral-400" />
      </div>
    );
  }

  if (!pedido) {
    return <div className="py-24 text-center text-neutral-500">Pedido no encontrado.</div>;
  }

  const estadoInfo = ESTADO_CONFIG[pedido.estado];
  const Icon = estadoInfo.icon;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pedido {pedido.numero}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {new Date(pedido.createdAt).toLocaleDateString('es-EC', { dateStyle: 'long' })}
          </p>
        </div>
        <Badge variant={estadoInfo.variant}>
          <Icon className="mr-1 inline h-3.5 w-3.5" /> {estadoInfo.label}
        </Badge>
      </div>

      {pedido.numeroSeguimiento && (
        <div className="mb-6 rounded-xl bg-blue-50 p-4 text-sm dark:bg-blue-950">
          Número de seguimiento: <strong>{pedido.numeroSeguimiento}</strong>
        </div>
      )}

      <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
        <h2 className="mb-4 font-semibold">Productos</h2>
        <div className="flex flex-col gap-3">
          {pedido.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.cantidad}x {item.nombreProducto}
              </span>
              <span>{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-2 border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(pedido.subtotal)}</span>
          </div>
          {Number(pedido.descuento) > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Descuento</span>
              <span>-{formatPrice(pedido.descuento)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>IVA</span>
            <span>{formatPrice(pedido.iva)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span>{Number(pedido.costoEnvio) === 0 ? 'Gratis' : formatPrice(pedido.costoEnvio)}</span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(pedido.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
        <h2 className="mb-2 font-semibold">Dirección de envío</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {pedido.direccion.destinatario} · {pedido.direccion.calle} {pedido.direccion.numero},{' '}
          {pedido.direccion.ciudad}, {pedido.direccion.provincia}
        </p>
      </div>

      {CANCELABLE_STATES.includes(pedido.estado) && (
        <div className="mt-6 flex justify-end">
          <Button variant="danger" onClick={() => setShowCancelDialog(true)}>
            Cancelar pedido
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={showCancelDialog}
        title="Cancelar pedido"
        description="Esta acción restituirá el stock de los productos. ¿Seguro que quieres cancelar este pedido?"
        variant="danger"
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        onConfirm={handleCancel}
        onCancel={() => setShowCancelDialog(false)}
        loading={cancelOrder.isPending}
      />
    </div>
  );
}
