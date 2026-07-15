import { Search } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useProductAutocomplete } from '@/hooks/useProductAutocomplete';
import { formatPrice } from '@/utils/formatPrice';

export function SearchAutocomplete({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data: sugerencias } = useProductAutocomplete(debouncedQuery);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setOpen(false));

  const goToCatalog = (): void => {
    if (!query.trim()) return;
    navigate(`/catalogo?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === 'Enter' && goToCatalog()}
        placeholder="Buscar productos..."
        className="h-10 w-full rounded-full border border-neutral-300 bg-neutral-50 pl-9 pr-4 text-sm outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white"
      />
      {open && sugerencias && sugerencias.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          {sugerencias.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                navigate(`/productos/${p.slug}`);
                setOpen(false);
                setQuery('');
                onNavigate?.();
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {p.imagenes[0]?.url && (
                <img src={p.imagenes[0].url} alt="" className="h-10 w-10 rounded-lg object-cover" />
              )}
              <span className="flex-1 truncate text-sm">{p.nombre}</span>
              <span className="text-sm font-medium">{formatPrice(p.precio)}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={goToCatalog}
            className="w-full border-t border-neutral-100 px-4 py-2 text-center text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            Ver todos los resultados para &quot;{query}&quot;
          </button>
        </div>
      )}
    </div>
  );
}
