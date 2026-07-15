import clsx from 'clsx';
import { Heart, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useAddFavorite, useIsFavorite, useRemoveFavorite } from '@/hooks/useFavorites';
import type { Producto } from '@/types/product';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function ProductCard({ producto }: { producto: Producto }) {
  const { usuario } = useAuth();
  const isFavorite = useIsFavorite(producto.id);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const toast = useToast();
  const navigate = useNavigate();

  const imagen = producto.imagenes[0]?.url;
  const tieneDescuento = Boolean(
    producto.precioAnterior && Number(producto.precioAnterior) > Number(producto.precio),
  );
  const descuentoPct = tieneDescuento
    ? Math.round((1 - Number(producto.precio) / Number(producto.precioAnterior)) * 100)
    : 0;

  const handleToggleFavorite = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    if (!usuario) {
      navigate('/login');
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite.mutateAsync(producto.id);
      } else {
        await addFavorite.mutateAsync(producto.id);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <Link
      to={`/productos/${producto.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {imagen && (
          <img
            src={imagen}
            alt={producto.nombre}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {tieneDescuento && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
            -{descuentoPct}%
          </span>
        )}
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 shadow-sm transition-colors hover:bg-white dark:bg-neutral-900/90 dark:hover:bg-neutral-900"
        >
          <Heart className={clsx('h-4 w-4', isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-500')} />
        </button>
        {producto.stock === 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-semibold text-white">
            Agotado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase text-neutral-400">{producto.marca.nombre}</span>
        <h3 className="line-clamp-2 text-sm font-medium">{producto.nombre}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {Number(producto.valoracionProm).toFixed(1)} ({producto.totalResenas})
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold">{formatPrice(producto.precio)}</span>
          {tieneDescuento && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(producto.precioAnterior as string)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
