import * as Sentry from '@sentry/react';

// Sin VITE_SENTRY_DSN configurado, esto no hace nada: Sentry.init nunca se
// llama, y el resto del SDK queda inactivo (no-op seguro).
export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 0,
  });
}
