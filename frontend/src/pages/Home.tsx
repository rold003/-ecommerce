import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useProducts } from '@/hooks/useProducts';

export default function Home() {
  const { data, isLoading } = useProducts({ destacado: true, limit: 8 });
  useDocumentMeta('Inicio', 'Tecnología, moda y hogar con envío rápido y garantía en cada compra.');

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

      <section className="mt-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Productos destacados</h2>
          <Link
            to="/catalogo"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Ver todo
          </Link>
        </div>
        <ProductGrid productos={data?.items ?? []} loading={isLoading} />
      </section>
    </div>
  );
}
