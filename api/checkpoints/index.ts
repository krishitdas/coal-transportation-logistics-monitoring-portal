import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb.js';
import RouteCheckpoint from '../../models/RouteCheckpoint.js';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { checkpointSchema } from '../../validators/checkpoint.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();

  if (req.method === 'POST') {
    try {
      const checkpoint = new RouteCheckpoint(req.body);
      await checkpoint.save();
      return res.status(201).json({ data: checkpoint });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create checkpoint' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => {
  if (req.method === 'POST') return validate(checkpointSchema, handler)(req, res);
  return handler(req, res);
});