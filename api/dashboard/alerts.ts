import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import Alert from '../../models/Alert';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    try {
      const alerts = await Alert.find({ status: 'Active' })
        .populate('relatedTripId', 'tripId')
        .populate('relatedVehicleId', 'vehicleNumber')
        .sort({ severity: 1, createdAt: -1 })
        .limit(5);
      return res.status(200).json({ data: alerts });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch dashboard alerts' });
    }
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);