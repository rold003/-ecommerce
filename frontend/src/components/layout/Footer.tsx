import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-lg font-bold">Tienda</h3>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Tecnología, moda y hogar con envío a todo el país.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Tienda</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
            <li>
              <Link to="/catalogo" className="hover:text-neutral-900 dark:hover:text-white">
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/categorias" className="hover:text-neutral-900 dark:hover:text-white">
                Categorías
              </Link>
            </li>
            <li>
              <Link to="/favoritos" className="hover:text-neutral-900 dark:hover:text-white">
                Favoritos
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Cuenta</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
            <li>
              <Link to="/pedidos" className="hover:text-neutral-900 dark:hover:text-white">
                Mis pedidos
              </Link>
            </li>
            <li>
              <Link to="/perfil" className="hover:text-neutral-900 dark:hover:text-white">
                Perfil
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-neutral-900 dark:hover:text-white">
                Iniciar sesión
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Ayuda</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
            <li>Envíos y devoluciones</li>
            <li>Preguntas frecuentes</li>
            <li>Contacto</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        © {new Date().getFullYear()} Tienda Online. Todos los derechos reservados.
      </div>
    </footer>
  );
}
