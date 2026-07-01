import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb.js';
import RouteCheckpoint from '../../models/RouteCheckpoint.js';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { tripId } = req.query;
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const checkpoints = await RouteCheckpoint.find({ tripId }).sort({ timestamp: -1 });
      return res.status(200).json({ data: checkpoints });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch checkpoints' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);