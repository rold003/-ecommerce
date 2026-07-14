import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors';
import { isProduction } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { apiLimiter } from './middlewares/rateLimiter';
import routes from './routes';

export function createApp(): Application {
  const app = express();

  // Necesario detrás de un proxy/balanceador (Render, etc.) para que rate-limit
  // y cookies "secure" identifiquen correctamente el protocolo/IP real.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());
  app.use(morgan(isProduction ? 'combined' : 'dev'));

  app.use('/api', apiLimiter);
  app.use('/api/v1', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
