import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb.js';
import Trip from '../../models/Trip.js';
import Vehicle from '../../models/Vehicle.js';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
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

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);