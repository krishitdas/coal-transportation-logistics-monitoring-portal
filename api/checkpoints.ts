import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../lib/mongodb.js';
import RouteCheckpoint from '../models/RouteCheckpoint.js';
import { withAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { checkpointSchema } from '../validators/checkpoint.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  
  const path = req.url ? req.url.split('?')[0] : '';
  const segments = path.split('/').filter(Boolean);

  if (req.method === 'POST') {
    try {
      const checkpoint = new RouteCheckpoint(req.body);
      await checkpoint.save();
      return res.status(201).json({ data: checkpoint });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create checkpoint' });
    }
  }

  if (req.method === 'GET') {
    try {
      let tripId = req.query.tripId as string;
      if (!tripId) {
        const index = segments.findIndex(s => s === 'checkpoints');
        if (index !== -1 && index + 1 < segments.length) {
            tripId = segments[index + 1];
        }
      }
      
      if (!tripId) {
        return res.status(400).json({ error: 'Missing tripId' });
      }

      const checkpoints = await RouteCheckpoint.find({ tripId }).sort({ timestamp: -1 });
      return res.status(200).json({ data: checkpoints });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch checkpoints' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => {
  if (req.method === 'POST') return validate(checkpointSchema, handler)(req, res);
  return handler(req, res);
});
