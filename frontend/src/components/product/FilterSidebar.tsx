import clsx from 'clsx';
import type { Categoria, Marca } from '@/types/product';

interface FilterSidebarProps {
  categorias: Categoria[];
  marcas: Marca[];
  filters: { categoria?: string; marca?: string; disponible?: boolean };
  onChange: (key: string, value: string | undefined) => void;
}

export function FilterSidebar({ categorias, marcas, filters, onChange }: FilterSidebarProps) {
  return (
    <aside className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Categoría</h3>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onChange('categoria', undefined)}
            className={clsx(
              'text-left text-sm',
              !filters.categoria ? 'font-semibold' : 'text-neutral-500 dark:text-neutral-400',
            )}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange('categoria', cat.slug)}
              className={clsx(
                'text-left text-sm',
                filters.categoria === cat.slug ? 'font-semibold' : 'text-neutral-500 dark:text-neutral-400',
              )}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Marca</h3>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onChange('marca', undefined)}
            className={clsx(
              'text-left text-sm',
              !filters.marca ? 'font-semibold' : 'text-neutral-500 dark:text-neutral-400',
            )}
          >
            Todas
          </button>
          {marcas.map((marca) => (
            <button
              key={marca.id}
              type="button"
              onClick={() => onChange('marca', marca.slug)}
              className={clsx(
                'text-left text-sm',
                filters.marca === marca.slug ? 'font-semibold' : 'text-neutral-500 dark:text-neutral-400',
              )}
            >
              {marca.nombre}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(filters.disponible)}
            onChange={(e) => onChange('disponible', e.target.checked ? 'true' : undefined)}
            className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700"
          />
          Solo disponibles
        </label>
      </div>
    </aside>
  );
}
