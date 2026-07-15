import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import {
  useApplyCoupon,
  useCart,
  useRemoveCartItem,
  useRemoveCoupon,
  useUpdateCartItem,
} from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/getErrorMessage';

export default function Cart() {
  const { data: carrito, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const applyCoupon = useApplyCoupon();
  const removeCoupon = useRemoveCoupon();
  const [couponCode, setCouponCode] = useState('');
  const toast = useToast();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-neutral-400" />
      </div>
    );
  }

  if (!carrito || carrito.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Tu carrito está vacío"
          description="Agrega productos desde el catálogo para verlos aquí."
          action={
            <Link to="/catalogo">
              <Button>Ir al catálogo</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const handleApplyCoupon = async (): Promise<void> => {
    if (!couponCode.trim()) return;
    try {
      await applyCoupon.mutateAsync(couponCode.trim());
      toast.success('Cupón aplicado');
      setCouponCode('');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">Carrito de compras</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {carrito.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
            >
              {item.producto.imagenes[0] && (
                <img
                  src={item.producto.imagenes[0].url}
                  alt={item.producto.nombre}
                  className="h-20 w-20 rounded-lg object-cover"
                />
              )}
              <div className="flex flex-1 flex-col">
                <Link to={`/productos/${item.producto.slug}`} className="font-medium hover:underline">
                  {item.producto.nombre}
                </Link>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatPrice(item.producto.precio)}
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateItem.mutate({ productoId: item.productoId, cantidad: Math.max(1, item.cantidad - 1) })
                    }
                    className="rounded-lg border border-neutral-300 p-1 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.cantidad}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateItem.mutate({ productoId: item.productoId, cantidad: item.cantidad + 1 })
                    }
                    disabled={item.cantidad >= item.producto.stock}
                    className="rounded-lg border border-neutral-300 p-1 hover:bg-neutral-100 disabled:opacity-30 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem.mutate(item.productoId)}
                    className="ml-auto text-red-500 hover:text-red-700"
                    aria-label="Eliminar del carrito"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right font-semibold">
                {formatPrice(Number(item.producto.precio) * item.cantidad)}
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="mb-4 font-semibold">Resumen</h2>
          <div className="flex flex-col gap-2 text-sm">
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

          <div className="mt-4">
            {carrito.cupon ? (
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm dark:bg-emerald-950">
                <span>
                  Cupón <strong>{carrito.cupon.codigo}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => removeCoupon.mutate()}
                  className="text-red-500 hover:underline"
                >
                  Quitar
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Código de cupón"
                  className="h-10 flex-1 rounded-lg border border-neutral-300 px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                />
                <Button variant="outline" onClick={handleApplyCoupon} loading={applyCoupon.isPending}>
                  Aplicar
                </Button>
              </div>
            )}
          </div>

          <Link to="/checkout">
            <Button fullWidth size="lg" className="mt-6">
              Proceder al pago
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
