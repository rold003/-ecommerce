import clsx from 'clsx';
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/categorias', label: 'Categorías' },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  // TODO: se reemplaza por el conteo real del CartContext en el módulo de carrito.
  const cartCount = 0;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <ShoppingBag className="h-6 w-6" />
          <span className="hidden sm:inline">Tienda</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'text-sm font-medium transition-colors hover:text-neutral-900 dark:hover:text-white',
                  isActive ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden flex-1 items-center md:flex">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Buscar productos..."
              className="h-10 w-full rounded-full border border-neutral-300 bg-neutral-50 pl-9 pr-4 text-sm outline-none transition-colors focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-white"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link
            to="/favoritos"
            className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Favoritos"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            to="/carrito"
            className="relative rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Carrito"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white dark:bg-white dark:text-neutral-900">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/login"
            className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Cuenta"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden"
            aria-label="Menú"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-200 px-4 py-3 md:hidden dark:border-neutral-800">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Buscar productos..."
              className="h-10 w-full rounded-full border border-neutral-300 bg-neutral-50 pl-9 pr-4 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
