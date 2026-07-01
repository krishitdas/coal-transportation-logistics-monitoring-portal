import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import Vehicle from '../../models/Vehicle';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { vehicleSchema } from '../../validators/vehicle';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const query: any = {};
      if (search) {
        query.vehicleNumber = { $regex: search, $options: 'i' };
      }

      const vehicles = await Vehicle.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));
        
      const total = await Vehicle.countDocuments(query);
      
      return res.status(200).json({ data: vehicles, meta: { total, page: Number(page), limit: Number(limit) } });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
  }

  if (req.method === 'POST') {
    try {
      const vehicle = new Vehicle(req.body);
      await vehicle.save();
      return res.status(201).json({ data: vehicle });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create vehicle' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => {
  if (req.method === 'POST') return validate(vehicleSchema, handler)(req, res);
  return handler(req, res);
});