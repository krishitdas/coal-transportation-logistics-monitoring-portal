import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../lib/mongodb.js';
import Vehicle from '../models/Vehicle.js';
import { withAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { vehicleSchema, vehicleUpdateSchema } from '../validators/vehicle.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  
  const path = req.url ? req.url.split('?')[0] : '';
  const segments = path.split('/').filter(Boolean);
  
  let id = req.query.id as string;
  if (!id) {
    const index = segments.findIndex(s => s === 'vehicles');
    if (index !== -1 && index + 1 < segments.length) {
        id = segments[index + 1];
    }
  }

  if (id) {
    if (req.method === 'GET') {
      try {
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        return res.status(200).json({ data: vehicle });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch vehicle' });
      }
    }

    if (req.method === 'PUT') {
      try {
        const vehicle = await Vehicle.findByIdAndUpdate(id, req.body, { new: true });
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        return res.status(200).json({ data: vehicle });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to update vehicle' });
      }
    }

    if (req.method === 'DELETE') {
      try {
        const vehicle = await Vehicle.findByIdAndDelete(id);
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        return res.status(200).json({ success: true, message: 'Vehicle deleted' });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to delete vehicle' });
      }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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
  const path = req.url ? req.url.split('?')[0] : '';
  const segments = path.split('/').filter(Boolean);
  
  let id = req.query.id as string;
  if (!id) {
    const index = segments.findIndex(s => s === 'vehicles');
    if (index !== -1 && index + 1 < segments.length) {
        id = segments[index + 1];
    }
  }

  if (id && req.method === 'PUT') return validate(vehicleUpdateSchema, handler)(req, res);
  if (!id && req.method === 'POST') return validate(vehicleSchema, handler)(req, res);
  return handler(req, res);
});
