import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../lib/mongodb.js';
import Trip from '../models/Trip.js';
import Vehicle from '../models/Vehicle.js';
import Alert from '../models/Alert.js';
import { withAuth, AuthenticatedRequest } from '../middleware/auth.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();

  const path = req.url ? req.url.split('?')[0] : '';
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (path.endsWith('/alerts')) {
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

  if (path.endsWith('/kpis')) {
    try {
      const activeTrips = await Trip.countDocuments({ status: { $in: ['InTransit', 'Delayed', 'Flagged'] } });
      const totalVehicles = await Vehicle.countDocuments({ active: true });
      const completedToday = await Trip.countDocuments({ 
        status: 'Delivered',
        actualArrival: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      });
      
      // Placeholder data
      return res.status(200).json({ 
        data: {
          activeTrips,
          totalVehicles,
          completedToday,
          totalTonnage: 15200 // Mock data for now
        }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch KPIs' });
    }
  }

  if (path.endsWith('/live-trips')) {
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

  if (path.endsWith('/trends')) {
    return res.status(200).json({ 
      data: [
        { date: '2026-06-25', count: 120 },
        { date: '2026-06-26', count: 140 },
        { date: '2026-06-27', count: 135 },
        { date: '2026-06-28', count: 150 },
        { date: '2026-06-29', count: 160 },
        { date: '2026-06-30', count: 145 },
        { date: '2026-07-01', count: 180 },
      ]
    });
  }

  return res.status(404).json({ error: 'Not Found' });
}

export default withAuth(handler);
