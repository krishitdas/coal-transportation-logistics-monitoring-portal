import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb.js';
import Trip from '../../models/Trip.js';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    try {
      const data = await Trip.find({ status: 'Delayed' }).populate('vehicleId', 'vehicleNumber');
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch delayed report' });
    }
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);