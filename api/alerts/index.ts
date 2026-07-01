import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import Alert from '../../models/Alert';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query: any = {};
      if (status) query.status = status;

      const alerts = await Alert.find(query)
        .populate('relatedTripId')
        .populate('relatedVehicleId')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));
        
      const total = await Alert.countDocuments(query);
      
      return res.status(200).json({ data: alerts, meta: { total, page: Number(page), limit: Number(limit) } });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);