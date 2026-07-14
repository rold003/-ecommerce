import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

// Hero estático por ahora; el módulo de Catálogo añade productos destacados y
// categorías reales traídos de la API en esta misma página.
export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 rounded-3xl bg-neutral-50 px-6 py-20 text-center dark:bg-neutral-900"
      >
        <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900">
          Nueva colección
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Tecnología, moda y hogar en un solo lugar
        </h1>
        <p className="max-w-xl text-neutral-500 dark:text-neutral-400">
          Descubre productos seleccionados con envío rápido y garantía en cada compra.
        </p>
        <Link to="/catalogo">
          <Button size="lg">
            Ver catálogo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
