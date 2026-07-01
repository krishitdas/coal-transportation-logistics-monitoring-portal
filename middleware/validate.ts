import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject, handler: (req: VercelRequest, res: VercelResponse) => void | Promise<void>) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      if (req.body) {
        req.body = await schema.parseAsync(req.body);
      }
      return handler(req, res);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(400).json({ error: 'Validation Error' });
    }
  };
};
