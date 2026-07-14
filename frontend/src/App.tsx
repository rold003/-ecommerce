import { Moon, ShoppingBag, Sun } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

// Placeholder de verificación de la configuración base (Tailwind, modo oscuro/claro,
// React Query, React Router). El layout y las páginas reales llegan en los siguientes
// módulos del frontend.
function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex items-center gap-3">
        <ShoppingBag className="h-8 w-8 text-neutral-900 dark:text-white" />
        <h1 className="text-2xl font-semibold tracking-tight">Tienda Online</h1>
      </div>
      <p className="max-w-md text-center text-sm text-neutral-500 dark:text-neutral-400">
        Configuración base del frontend lista: Vite + React 19 + TypeScript + Tailwind CSS,
        React Router, TanStack Query y modo oscuro/claro.
      </p>
      <button
        type="button"
        onClick={toggleTheme}
        className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        Modo {theme === 'dark' ? 'claro' : 'oscuro'}
      </button>
    </div>
  );
}

export default App;
