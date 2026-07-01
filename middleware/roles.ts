import type { VercelResponse } from '@vercel/node';
import { AuthenticatedRequest } from './auth';

export const withRoles = (allowedRoles: string[], handler: (req: AuthenticatedRequest, res: VercelResponse) => void | Promise<void>) => {
  return async (req: AuthenticatedRequest, res: VercelResponse) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    return handler(req, res);
  };
};
