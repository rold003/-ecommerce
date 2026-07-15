import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useFavorites } from '@/hooks/useFavorites';

export default function Favorites() {
  const { data: favoritos, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-neutral-400" />
      </div>
    );
  }

  if (!favoritos || favoritos.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <EmptyState
          icon={Heart}
          title="No tienes favoritos todavía"
          description="Guarda los productos que te gusten para encontrarlos fácilmente después."
          action={
            <Link to="/catalogo">
              <Button>Explorar catálogo</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">Mis favoritos</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {favoritos.map((fav) => (
          <ProductCard key={fav.id} producto={fav.producto} />
        ))}
      </div>
    </div>
  );
}
