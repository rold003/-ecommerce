interface ProductoVendido {
  id: string;
  nombre: string;
  vendidos: number;
}

// Lista rankeada de una sola magnitud: un solo hue secuencial (las entidades se
// identifican por el nombre en texto, no por color), sin necesidad de leyenda.
export function TopProductsChart({ data }: { data: ProductoVendido[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">Sin ventas todavía.</p>;
  }

  const max = Math.max(...data.map((d) => d.vendidos), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((p) => {
        const pct = max > 0 ? (p.vendidos / max) * 100 : 0;
        return (
          <div key={p.id} className="flex items-center gap-3">
            <span className="w-32 shrink-0 truncate text-sm text-neutral-600 dark:text-neutral-400">
              {p.nombre}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-[#2a78d6] dark:bg-[#3987e5]"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-sm font-medium tabular-nums">{p.vendidos}</span>
          </div>
        );
      })}
    </div>
  );
}
