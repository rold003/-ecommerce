import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { corsOptions } from './config/cors';
import { isProduction } from './config/env';
import { openApiDocument } from './docs/openapi';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { apiLimiter } from './middlewares/rateLimiter';
import routes from './routes';
import { sitemapService } from './services/sitemap.service';

export function createApp(): Application {
  const app = express();

  // Necesario detrás de un proxy/balanceador (Render, etc.) para que rate-limit
  // y cookies "secure" identifiquen correctamente el protocolo/IP real.
  app.set('trust proxy', 1);

  // Swagger UI se sirve de sus propios assets con <script> inline para inicializarse,
  // lo que violaría el CSP estricto de Helmet (script-src 'self', sin unsafe-inline).
  // Se monta antes de app.use(helmet()) para que esta ruta nunca pase por ese CSP;
  // el resto de la API sí queda protegida por Helmet normalmente.
  app.get('/api-docs.json', (_req, res) => res.json(openApiDocument));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());
  app.use(morgan(isProduction ? 'combined' : 'dev'));

  app.get('/sitemap.xml', async (_req, res, next) => {
    try {
      const xml = await sitemapService.build();
      res.type('application/xml').send(xml);
    } catch (err) {
      next(err);
    }
  });

  app.use('/api', apiLimiter);
  app.use('/api/v1', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
