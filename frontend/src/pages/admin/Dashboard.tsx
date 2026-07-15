import { Clock, DollarSign, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { DailySalesChart } from '@/components/admin/DailySalesChart';
import { OrderStatusBreakdown } from '@/components/admin/OrderStatusBreakdown';
import { StatTile } from '@/components/admin/StatTile';
import { TopProductsChart } from '@/components/admin/TopProductsChart';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { formatPrice } from '@/utils/formatPrice';

export default function Dashboard() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatTile
          label="Ventas hoy"
          value={formatPrice(data.ventasHoy.total)}
          icon={DollarSign}
          hint={`${data.ventasHoy.pedidos} pedido(s)`}
        />
        <StatTile
          label="Ventas del mes"
          value={formatPrice(data.ventasMes.total)}
          icon={TrendingUp}
          hint={`${data.ventasMes.pedidos} pedido(s)`}
        />
        <StatTile label="Pedidos pendientes" value={String(data.pedidosPendientes)} icon={Clock} />
        <StatTile label="Clientes nuevos (mes)" value={String(data.clientesNuevosMes)} icon={Users} />
        <StatTile label="Productos activos" value={String(data.totalProductos)} icon={Package} />
        <StatTile label="Total clientes" value={String(data.totalClientes)} icon={ShoppingBag} />
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold">Ventas diarias (últimos 30 días)</h2>
        <DailySalesChart data={data.ventasDiarias} />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 font-semibold">Pedidos por estado</h2>
          <OrderStatusBreakdown data={data.pedidosPorEstado} />
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 font-semibold">Productos más vendidos</h2>
          <TopProductsChart data={data.productosMasVendidos} />
        </Card>
      </div>
    </div>
  );
}
