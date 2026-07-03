import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../lib/mongodb.js';
import Alert from '../models/Alert.js';
import { withAuth, AuthenticatedRequest } from '../middleware/auth.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  
  const path = req.url ? req.url.split('?')[0] : '';
  const segments = path.split('/').filter(Boolean);
  const isRead = path.endsWith('/read');

  if (req.method === 'GET' && !isRead) {
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

  if (req.method === 'PUT' && isRead) {
    try {
      let id = req.query.id as string;
      if (!id) {
        const alertsIndex = segments.findIndex(s => s === 'alerts');
        if (alertsIndex !== -1 && alertsIndex + 1 < segments.length) {
            id = segments[alertsIndex + 1];
        }
      }
      
      const alert = await Alert.findByIdAndUpdate(id, { status: 'Acknowledged' }, { new: true });
      if (!alert) return res.status(404).json({ error: 'Alert not found' });
      return res.status(200).json({ data: alert });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update alert' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);
