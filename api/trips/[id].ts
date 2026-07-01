import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb.js';
import Trip from '../../models/Trip.js';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { tripUpdateSchema } from '../../validators/trip.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { id } = req.query;
  await connectToDatabase();

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

export default withAuth((req, res) => {
  if (req.method === 'PUT') return validate(tripUpdateSchema, handler)(req, res);
  return handler(req, res);
});
