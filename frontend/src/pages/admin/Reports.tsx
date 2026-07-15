import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useAdminSalesReport } from '@/hooks/useAdminDashboard';
import { formatPrice } from '@/utils/formatPrice';

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function Reports() {
  const today = new Date();
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  const [desde, setDesde] = useState(toISODate(monthAgo));
  const [hasta, setHasta] = useState(toISODate(today));
  const [appliedRange, setAppliedRange] = useState({ desde: toISODate(monthAgo), hasta: toISODate(today) });

  const { data, isLoading } = useAdminSalesReport(appliedRange.desde, appliedRange.hasta);

  const handleApply = (): void => {
    setAppliedRange({ desde, hasta });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Reportes de ventas</h1>

      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-end">
        <Input label="Desde" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        <Input label="Hasta" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        <Button onClick={handleApply}>Generar reporte</Button>
      </Card>

      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner className="h-8 w-8 text-neutral-400" />
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Total vendido</span>
              <p className="mt-2 text-2xl font-bold tabular-nums">{formatPrice(data.totalVentas)}</p>
            </Card>
            <Card className="p-5">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Pedidos</span>
              <p className="mt-2 text-2xl font-bold tabular-nums">{data.totalPedidos}</p>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="mb-4 font-semibold">Productos más vendidos en el rango</h2>
            {data.productosMasVendidos.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Sin ventas en este rango.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-neutral-200 text-left text-xs uppercase text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    <tr>
                      <th className="py-2">Producto</th>
                      <th className="py-2">Unidades vendidas</th>
                      <th className="py-2">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.productosMasVendidos.map((p) => (
                      <tr
                        key={p.productoId}
                        className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                      >
                        <td className="py-2 font-medium">{p.nombre}</td>
                        <td className="py-2">{p.unidadesVendidas}</td>
                        <td className="py-2">{formatPrice(p.ingresos)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      ) : null}
    </div>
  );
}
