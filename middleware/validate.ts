import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema, handler: (req: any, res: VercelResponse) => any | Promise<any>) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      if (req.body) {
        req.body = await schema.parseAsync(req.body);
      }
      return handler(req, res);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      return res.status(400).json({ error: 'Validation Error' });
    }
  };
};
