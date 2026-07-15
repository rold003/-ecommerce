import { useState } from 'react';
import { formatPrice } from '@/utils/formatPrice';

interface DataPoint {
  fecha: string;
  total: number;
}

const WIDTH = 720;
const HEIGHT = 200;
const BOTTOM_AXIS = 20;

// Grafico de barras de una sola serie (un solo hue secuencial azul, sin necesidad de
// leyenda). Barras finas con extremo redondeado, ancladas a la linea base, con
// tooltip al pasar el mouse. Colores validados con scripts/validate_palette.js.
export function DailySalesChart({ data }: { data: DataPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);

  if (data.length === 0) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400">Sin datos de ventas todavía.</p>;
  }

  const max = Math.max(...data.map((d) => d.total), 1);
  const plotHeight = HEIGHT - BOTTOM_AXIS;
  const barGap = 2;
  const barWidth = WIDTH / data.length - barGap;

  return (
    <div className="relative [--bar:#2a78d6] [--grid:#e1e0d9] dark:[--bar:#3987e5] dark:[--grid:#2c2c2a]">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Ventas diarias de los últimos 30 días"
      >
        <line x1={0} y1={plotHeight} x2={WIDTH} y2={plotHeight} stroke="var(--grid)" strokeWidth={1} />
        {data.map((d, i) => {
          const barHeight = (d.total / max) * (plotHeight - 8);
          const x = i * (barWidth + barGap);
          const y = plotHeight - barHeight;
          return (
            <rect
              key={d.fecha}
              x={x}
              y={y}
              width={Math.max(barWidth, 1)}
              height={Math.max(barHeight, 1)}
              rx={2}
              fill="var(--bar)"
              opacity={hover === null || hover === i ? 1 : 0.35}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </svg>
      {hover !== null && data[hover] && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs shadow-md dark:border-neutral-700 dark:bg-neutral-900"
          style={{ left: `${((hover + 0.5) / data.length) * 100}%`, top: 0 }}
        >
          <p className="font-medium">
            {new Date(data[hover].fecha).toLocaleDateString('es-EC', { day: '2-digit', month: 'short' })}
          </p>
          <p>{formatPrice(data[hover].total)}</p>
        </div>
      )}
    </div>
  );
}
