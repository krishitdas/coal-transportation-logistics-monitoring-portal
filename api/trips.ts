import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../lib/mongodb.js';
import Trip from '../models/Trip.js';
import { withAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { tripSchema, tripUpdateSchema } from '../validators/trip.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  
  const path = req.url ? req.url.split('?')[0] : '';
  const segments = path.split('/').filter(Boolean);
  
  let id = req.query.id as string;
  if (!id) {
    const index = segments.findIndex(s => s === 'trips');
    if (index !== -1 && index + 1 < segments.length) {
        id = segments[index + 1];
    }
  }

  // /api/trips/[id] logic
  if (id) {
    if (req.method === 'GET') {
      try {
        const trip = await Trip.findById(id).populate('vehicleId');
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        return res.status(200).json({ data: trip });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch trip' });
      }
    }

    if (req.method === 'PUT') {
      try {
        const trip = await Trip.findByIdAndUpdate(id, req.body, { new: true });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        return res.status(200).json({ data: trip });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to update trip' });
      }
    }

    if (req.method === 'DELETE') {
      try {
        const trip = await Trip.findByIdAndDelete(id);
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        return res.status(200).json({ success: true, message: 'Trip deleted' });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to delete trip' });
      }
    }
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // /api/trips logic
  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const query: any = {};
      
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { tripId: { $regex: search, $options: 'i' } },
          { driverName: { $regex: search, $options: 'i' } },
        ];
      }

      const trips = await Trip.find(query)
        .populate('vehicleId', 'vehicleNumber transporterName')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));
        
      const total = await Trip.countDocuments(query);
      
      return res.status(200).json({ data: trips, meta: { total, page: Number(page), limit: Number(limit) } });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch trips' });
    }
  }

  if (req.method === 'POST') {
    try {
      const trip = new Trip({
        ...req.body,
        createdBy: req.user!.userId
      });
      await trip.save();
      return res.status(201).json({ data: trip });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create trip' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => {
  const path = req.url ? req.url.split('?')[0] : '';
  const segments = path.split('/').filter(Boolean);
  
  let id = req.query.id as string;
  if (!id) {
    const index = segments.findIndex(s => s === 'trips');
    if (index !== -1 && index + 1 < segments.length) {
        id = segments[index + 1];
    }
  }

  if (id && req.method === 'PUT') return validate(tripUpdateSchema, handler)(req, res);
  if (!id && req.method === 'POST') return validate(tripSchema, handler)(req, res);
  
  return handler(req, res);
});
