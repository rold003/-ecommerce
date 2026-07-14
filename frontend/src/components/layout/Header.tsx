import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, LogOut, Menu, Moon, Package, Search, Settings, ShoppingBag, Sun, User, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useClickOutside } from '@/hooks/useClickOutside';

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/categorias', label: 'Categorías' },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { usuario, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setMenuOpen(false));
  // TODO: se reemplaza por el conteo real del CartContext en el módulo de carrito.
  const cartCount = 0;

  const handleLogout = async (): Promise<void> => {
    setMenuOpen(false);
    await logout();
  };

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
          {usuario ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Cuenta"
              >
                <User className="h-5 w-5" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
                      <p className="truncate text-sm font-medium">
                        {usuario.nombre} {usuario.apellido}
                      </p>
                      <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{usuario.email}</p>
                    </div>
                    <Link
                      to="/perfil"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <User className="h-4 w-4" /> Mi perfil
                    </Link>
                    <Link
                      to="/pedidos"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Package className="h-4 w-4" /> Mis pedidos
                    </Link>
                    {usuario.rol === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <Settings className="h-4 w-4" /> Panel admin
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-neutral-100 dark:text-red-400 dark:hover:bg-neutral-800"
                    >
                      <LogOut className="h-4 w-4" /> Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Cuenta"
            >
              <User className="h-5 w-5" />
            </Link>
          )}
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
