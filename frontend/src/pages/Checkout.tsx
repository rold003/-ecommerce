import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddressForm } from '@/components/checkout/AddressForm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import { useAddresses, useCreateAddress } from '@/hooks/useAddresses';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/order.service';
import type { AddressFormValues } from '@/utils/addressSchema';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/getErrorMessage';

const METODOS_PAGO = [
  { value: 'TARJETA', label: 'Tarjeta de crédito/débito' },
  { value: 'PAYPAL', label: 'PayPal' },
  { value: 'TRANSFERENCIA', label: 'Transferencia bancaria' },
  { value: 'CONTRA_ENTREGA', label: 'Pago contra entrega' },
];

export default function Checkout() {
  const { data: carrito, isLoading: loadingCart } = useCart();
  const { data: direcciones, isLoading: loadingAddresses } = useAddresses();
  const createAddress = useCreateAddress();
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>();
  const [metodoPago, setMetodoPago] = useState('TARJETA');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const direccionActiva =
    selectedAddressId ?? direcciones?.find((d) => d.predeterminada)?.id ?? direcciones?.[0]?.id;

  const handleCreateAddress = async (values: AddressFormValues): Promise<void> => {
    try {
      const nueva = await createAddress.mutateAsync(values);
      setSelectedAddressId(nueva.id);
      setShowAddressModal(false);
      toast.success('Dirección agregada');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleConfirm = async (): Promise<void> => {
    if (!direccionActiva) {
      toast.error('Selecciona o agrega una dirección de envío');
      return;
    }
    setSubmitting(true);
    try {
      const pedido = await orderService.checkout({ direccionId: direccionActiva, metodoPago });
      toast.success('Pedido realizado correctamente');
      navigate(`/pedidos/${pedido.id}`, { replace: true });
      // Se invalida después de navegar (sin await) para no disparar, mientras el
      // checkout todavía está montado, un re-render con el carrito ya vacío que
      // pisara la navegación de arriba.
      void queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudo completar el pedido'));
      setSubmitting(false);
    }
  };

  // El redirect a /carrito debe vivir en un efecto (no en el cuerpo del render) para
  // no disparar un setState de React Router mientras Checkout todavía se está
  // renderizando; se ignora mientras hay un pedido en curso (submitting) para no
  // pisar la navegación a /pedidos/:id que ocurre justo cuando el carrito queda vacío.
  useEffect(() => {
    if (!loadingCart && !submitting && (!carrito || carrito.items.length === 0)) {
      navigate('/carrito', { replace: true });
    }
  }, [carrito, loadingCart, submitting, navigate]);

  if (loadingCart || loadingAddresses) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-neutral-400" />
      </div>
    );
  }

  if (!carrito || carrito.items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Dirección de envío</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowAddressModal(true)}>
                <Plus className="h-4 w-4" /> Nueva
              </Button>
            </div>
            {direcciones && direcciones.length > 0 ? (
              <div className="flex flex-col gap-2">
                {direcciones.map((dir) => (
                  <label
                    key={dir.id}
                    className={clsx(
                      'flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm',
                      direccionActiva === dir.id
                        ? 'border-neutral-900 dark:border-white'
                        : 'border-neutral-200 dark:border-neutral-800',
                    )}
                  >
                    <input
                      type="radio"
                      checked={direccionActiva === dir.id}
                      onChange={() => setSelectedAddressId(dir.id)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">
                        {dir.etiqueta} · {dir.destinatario}
                      </p>
                      <p className="text-neutral-500 dark:text-neutral-400">
                        {dir.calle} {dir.numero}, {dir.ciudad}, {dir.provincia}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No tienes direcciones guardadas.
              </p>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-semibold">Método de pago</h2>
            <div className="flex flex-col gap-2">
              {METODOS_PAGO.map((m) => (
                <label
                  key={m.value}
                  className={clsx(
                    'flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm',
                    metodoPago === m.value
                      ? 'border-neutral-900 dark:border-white'
                      : 'border-neutral-200 dark:border-neutral-800',
                  )}
                >
                  <input type="radio" checked={metodoPago === m.value} onChange={() => setMetodoPago(m.value)} />
                  {m.label}
                </label>
              ))}
            </div>
          </Card>
        </div>

        <Card className="h-fit p-6">
          <h2 className="mb-4 font-semibold">Resumen del pedido</h2>
          <div className="flex flex-col gap-2 text-sm">
            {carrito.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="line-clamp-1">
                  {item.cantidad}x {item.producto.nombre}
                </span>
                <span>{formatPrice(Number(item.producto.precio) * item.cantidad)}</span>
              </div>
            ))}
            <div className="my-2 border-t border-neutral-200 dark:border-neutral-800" />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(carrito.subtotal)}</span>
            </div>
            {carrito.descuento > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Descuento</span>
                <span>-{formatPrice(carrito.descuento)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>IVA</span>
              <span>{formatPrice(carrito.iva)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span>{carrito.envio === 0 ? 'Gratis' : formatPrice(carrito.envio)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 text-base font-bold dark:border-neutral-800">
              <span>Total</span>
              <span>{formatPrice(carrito.total)}</span>
            </div>
          </div>
          <Button fullWidth size="lg" className="mt-6" onClick={handleConfirm} loading={submitting}>
            Confirmar pedido
          </Button>
        </Card>
      </div>

      <Modal open={showAddressModal} onClose={() => setShowAddressModal(false)} title="Nueva dirección">
        <AddressForm
          onSubmit={handleCreateAddress}
          submitting={createAddress.isPending}
          onCancel={() => setShowAddressModal(false)}
        />
      </Modal>
    </div>
  );
}
