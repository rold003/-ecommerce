import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCategories } from '@/hooks/useCategories';

export default function Categorias() {
  const { data: categorias, isLoading } = useCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">Categorías</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
          : categorias?.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${cat.slug}`}
                className="flex h-32 flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white text-center transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
              >
                <span className="font-semibold">{cat.nombre}</span>
              </Link>
            ))}
      </div>
    </div>
  );
}
