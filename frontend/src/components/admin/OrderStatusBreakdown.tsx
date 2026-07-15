interface EstadoCount {
  estado: string;
  cantidad: number;
}

// Colores categoricos en orden fijo (nunca reasignados segun el ranking de los
// datos), validados para separacion CVD con scripts/validate_palette.js. Cada barra
// lleva etiqueta directa (texto + numero) porque el WARN de contraste en modo claro
// para algunos tonos exige ese refuerzo en vez de depender solo del color.
const ESTADO_META: Record<string, { label: string; color: string }> = {
  PENDIENTE: { label: 'Pendiente', color: '#2a78d6' },
  PAGADO: { label: 'Pagado', color: '#1baf7a' },
  ENVIADO: { label: 'Enviado', color: '#eda100' },
  ENTREGADO: { label: 'Entregado', color: '#008300' },
  CANCELADO: { label: 'Cancelado', color: '#e34948' },
};

export function OrderStatusBreakdown({ data }: { data: EstadoCount[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">Sin pedidos todavía.</p>;
  }

  const max = Math.max(...data.map((d) => d.cantidad), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => {
        const meta = ESTADO_META[d.estado] ?? { label: d.estado, color: '#898781' };
        const pct = (d.cantidad / max) * 100;
        return (
          <div key={d.estado} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-sm text-neutral-600 dark:text-neutral-400">{meta.label}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: meta.color }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-sm font-medium tabular-nums">{d.cantidad}</span>
          </div>
        );
      })}
    </div>
  );
}
