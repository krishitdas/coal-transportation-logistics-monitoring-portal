import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb.js';
import Trip from '../../models/Trip.js';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    try {
      const today = new Date();
      today.setHours(0,0,0,0);
      const data = await Trip.find({ dispatchDate: { $gte: today } }).populate('vehicleId', 'vehicleNumber');
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch daily report' });
    }
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);