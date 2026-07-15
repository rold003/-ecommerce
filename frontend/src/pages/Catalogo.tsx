import { PackageSearch } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Select';
import { FilterSidebar } from '@/components/product/FilterSidebar';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useBrands } from '@/hooks/useBrands';
import { useCategories } from '@/hooks/useCategories';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useProducts } from '@/hooks/useProducts';

const SORT_OPTIONS = [
  { value: 'mas_recientes', label: 'Más recientes' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
  { value: 'mas_vendidos', label: 'Más vendidos' },
  { value: 'mejor_valorados', label: 'Mejor valorados' },
];

export default function Catalogo() {
  useDocumentMeta('Catálogo', 'Explora todo el catálogo: tecnología, moda y hogar con filtros por categoría, marca y precio.');
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      categoria: searchParams.get('categoria') ?? undefined,
      marca: searchParams.get('marca') ?? undefined,
      precioMin: searchParams.get('precioMin') ? Number(searchParams.get('precioMin')) : undefined,
      precioMax: searchParams.get('precioMax') ? Number(searchParams.get('precioMax')) : undefined,
      disponible: searchParams.get('disponible') === 'true' ? true : undefined,
      q: searchParams.get('q') ?? undefined,
      sort: searchParams.get('sort') ?? 'mas_recientes',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: 12,
    }),
    [searchParams],
  );

  const { data, isLoading } = useProducts(filters);
  const { data: categorias } = useCategories();
  const { data: marcas } = useBrands();

  const updateParam = (key: string, value: string | undefined): void => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">
          {filters.q ? `Resultados para "${filters.q}"` : 'Catálogo'}
        </h1>
        <Select
          value={filters.sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="w-full sm:w-56"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <FilterSidebar
          categorias={categorias ?? []}
          marcas={marcas ?? []}
          filters={filters}
          onChange={updateParam}
        />

        <div>
          {!isLoading && data?.items.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No encontramos productos"
              description="Ajusta los filtros o intenta con otra búsqueda."
            />
          ) : (
            <>
              <ProductGrid productos={data?.items ?? []} loading={isLoading} />
              {data && data.meta.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    page={data.meta.page}
                    totalPages={data.meta.totalPages}
                    onPageChange={(p) => updateParam('page', String(p))}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
