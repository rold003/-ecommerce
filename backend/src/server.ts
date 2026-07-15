import { createApp } from './app';
import { env } from './config/env';
import { initSentry } from './config/sentry';
import { prisma } from './database/prisma';

initSentry();

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${env.PORT} [${env.NODE_ENV}]`);
});

async function shutdown(signal: string): Promise<void> {
  console.log(`\n${signal} recibido, cerrando servidor...`);
  server.close(() => {
    prisma
      .$disconnect()
      .finally(() => {
        console.log('Servidor cerrado correctamente.');
        process.exit(0);
      });
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
