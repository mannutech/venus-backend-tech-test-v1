import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      next(result.error);
      return;
    }

    req.query = result.data;
    next();
  };
}
