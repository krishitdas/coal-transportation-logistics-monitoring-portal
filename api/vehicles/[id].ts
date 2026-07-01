import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb.js';
import Vehicle from '../../models/Vehicle.js';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { vehicleUpdateSchema } from '../../validators/vehicle.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { id } = req.query;
  await connectToDatabase();

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

export default withAuth((req, res) => {
  if (req.method === 'PUT') return validate(vehicleUpdateSchema, handler)(req, res);
  return handler(req, res);
});