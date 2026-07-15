import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Fragment } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg p-2 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) => (
        <Fragment key={p}>
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-neutral-400">…</span>}
          <button
            type="button"
            onClick={() => onPageChange(p)}
            className={clsx(
              'h-9 w-9 rounded-lg text-sm font-medium',
              p === page
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
            )}
          >
            {p}
          </button>
        </Fragment>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg p-2 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
