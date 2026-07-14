import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-8xl font-black text-neutral-200 dark:text-neutral-800">404</p>
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <p className="max-w-sm text-neutral-500 dark:text-neutral-400">
        La página que buscas no existe o fue movida.
      </p>
      <Link to="/">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  );
}
