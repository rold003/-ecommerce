import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

// Valida body/query/params contra un esquema Zod con forma { body?, query?, params? }.
// Si es inválido, lanza ZodError -> lo captura errorHandler y responde 400 con detalle.
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    }) as { body?: unknown; query?: unknown; params?: unknown };

    if (parsed.body !== undefined) req.body = parsed.body;
    next();
  };
