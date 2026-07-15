import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Producto } from '@/types/product';
import { formatPrice } from '@/utils/formatPrice';

export function ProductCard({ producto }: { producto: Producto }) {
  const imagen = producto.imagenes[0]?.url;
  const tieneDescuento = Boolean(
    producto.precioAnterior && Number(producto.precioAnterior) > Number(producto.precio),
  );
  const descuentoPct = tieneDescuento
    ? Math.round((1 - Number(producto.precio) / Number(producto.precioAnterior)) * 100)
    : 0;

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
