import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

interface ParsedRequest {
  body?: unknown;
  query?: unknown;
  params?: unknown;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      validated?: ParsedRequest;
    }
  }
}

// Valida body/query/params contra un esquema Zod con forma { body?, query?, params? }.
// Si es inválido, lanza ZodError -> lo captura errorHandler y responde 400 con detalle.
// El resultado parseado (con coerciones aplicadas) queda en req.validated, ya que en
// Express 5 req.query no admite reasignación directa.
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    }) as ParsedRequest;

    req.validated = parsed;
    if (parsed.body !== undefined) req.body = parsed.body;
    next();
  };
