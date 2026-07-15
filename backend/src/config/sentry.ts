import * as Sentry from '@sentry/node';
import { env, isProduction } from './env';

// Sin SENTRY_DSN configurado, esto no hace nada: Sentry.init nunca se llama,
// y captureException()/etc. en el resto del codigo quedan como no-ops seguros.
export function initSentry(): void {
  if (!env.SENTRY_DSN) return;

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    // Muestreo de trazas de performance bajo en produccion (no es un log de
    // errores, cuesta cuota de Sentry); en dev/test no interesa.
    tracesSampleRate: isProduction ? 0.1 : 0,
  });
}
