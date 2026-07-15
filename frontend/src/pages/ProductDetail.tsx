import clsx from 'clsx';
import { ShieldCheck, Star, Truck } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useProduct } from '@/hooks/useProducts';
import { api } from '@/services/api';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/getErrorMessage';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: producto, isLoading } = useProduct(slug ?? '');
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const { usuario } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = async (): Promise<void> => {
    if (!producto) return;
    if (!usuario) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setAdding(true);
    try {
      await api.post('/cart/items', { productoId: producto.id, cantidad: 1 });
      toast.success('Producto agregado al carrito');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Skeleton className="aspect-square w-full" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!producto) {
    return <div className="py-24 text-center text-neutral-500">Producto no encontrado.</div>;
  }

  const tieneDescuento = Boolean(
    producto.precioAnterior && Number(producto.precioAnterior) > Number(producto.precio),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
            {producto.imagenes[activeImage] && (
              <img
                src={producto.imagenes[activeImage].url}
                alt={producto.nombre}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {producto.imagenes.length > 1 && (
            <div className="mt-3 flex gap-2">
              {producto.imagenes.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={clsx(
                    'h-16 w-16 overflow-hidden rounded-lg border-2',
                    i === activeImage ? 'border-neutral-900 dark:border-white' : 'border-transparent',
                  )}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-medium uppercase text-neutral-400">{producto.marca.nombre}</span>
            <h1 className="text-2xl font-bold">{producto.nombre}</h1>
            <div className="mt-1 flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {Number(producto.valoracionProm).toFixed(1)} ({producto.totalResenas} reseñas)
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(producto.precio)}</span>
            {tieneDescuento && (
              <span className="text-lg text-neutral-400 line-through">
                {formatPrice(producto.precioAnterior as string)}
              </span>
            )}
          </div>

          <p className="text-neutral-600 dark:text-neutral-400">{producto.descripcion}</p>

          <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
            {producto.color && <span>Color: {producto.color}</span>}
            {producto.talla && <span>· Talla: {producto.talla}</span>}
            <span>· SKU: {producto.sku}</span>
          </div>

          <div className="text-sm">
            {producto.stock > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                En stock ({producto.stock} disponibles)
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">Agotado</span>
            )}
          </div>

          <Button size="lg" disabled={producto.stock === 0} loading={adding} onClick={handleAddToCart} fullWidth>
            Agregar al carrito
          </Button>

          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-neutral-200 pt-4 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Envío a todo el país
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Garantía de fábrica
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
