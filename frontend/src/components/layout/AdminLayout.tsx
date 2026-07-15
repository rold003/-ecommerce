import clsx from 'clsx';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Ticket,
  Users,
  ShoppingCart,
  FileBarChart,
  ArrowLeft,
} from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/categorias', label: 'Categorías', icon: FolderTree },
  { to: '/admin/marcas', label: 'Marcas', icon: Tag },
  { to: '/admin/cupones', label: 'Cupones', icon: Ticket },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/reportes', label: 'Reportes', icon: FileBarChart },
];

export function AdminLayout() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl">
      <aside className="hidden w-56 shrink-0 border-r border-neutral-200 px-3 py-6 md:block dark:border-neutral-800">
        <Link
          to="/"
          className="mb-6 flex items-center gap-2 px-3 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a la tienda
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
