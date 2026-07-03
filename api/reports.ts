import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../lib/mongodb.js';
import Trip from '../models/Trip.js';
import WeighbridgeEntry from '../models/WeighbridgeEntry.js';
import { withAuth, AuthenticatedRequest } from '../middleware/auth.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  
  const path = req.url ? req.url.split('?')[0] : '';

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (path.endsWith('/daily')) {
    try {
      const today = new Date();
      today.setHours(0,0,0,0);
      const data = await Trip.find({ dispatchDate: { $gte: today } }).populate('vehicleId', 'vehicleNumber');
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch daily report' });
    }
  }

  if (path.endsWith('/delayed')) {
    try {
      const data = await Trip.find({ status: 'Delayed' }).populate('vehicleId', 'vehicleNumber');
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch delayed report' });
    }
  }

  if (path.endsWith('/routes')) {
    return res.status(200).json({ data: [] }); // placeholder
  }

  if (path.endsWith('/utilization')) {
    return res.status(200).json({ data: [] }); // placeholder
  }

  if (path.endsWith('/variance')) {
    try {
      const data = await WeighbridgeEntry.find({ variancePercentage: { $gt: 2 } }).populate('tripId');
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch variance report' });
    }
  }

  return res.status(404).json({ error: 'Not Found' });
}

export default withAuth(handler);
