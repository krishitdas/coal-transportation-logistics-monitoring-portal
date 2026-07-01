import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import Trip from '../../models/Trip';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    try {
      const trips = await Trip.find({ status: 'InTransit' })
        .populate('vehicleId', 'vehicleNumber')
        .sort({ dispatchDate: -1 })
        .limit(10);
      return res.status(200).json({ data: trips });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch live trips' });
    }
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);