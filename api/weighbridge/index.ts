import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb.js';
import WeighbridgeEntry from '../../models/WeighbridgeEntry.js';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { weighbridgeSchema } from '../../validators/weighbridge.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, tripId } = req.query;
      const query: any = {};
      if (tripId) query.tripId = tripId;

      const entries = await WeighbridgeEntry.find(query)
        .populate('tripId')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));
        
      const total = await WeighbridgeEntry.countDocuments(query);
      
      return res.status(200).json({ data: entries, meta: { total, page: Number(page), limit: Number(limit) } });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch weighbridge entries' });
    }
  }

  if (req.method === 'POST') {
    try {
      const entry = new WeighbridgeEntry({
        ...req.body,
        recordedBy: req.user!.userId
      });
      await entry.save();
      return res.status(201).json({ data: entry });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create weighbridge entry' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => {
  if (req.method === 'POST') return validate(weighbridgeSchema, handler)(req, res);
  return handler(req, res);
});