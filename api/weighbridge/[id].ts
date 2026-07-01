import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb.js';
import WeighbridgeEntry from '../../models/WeighbridgeEntry.js';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { weighbridgeUpdateSchema } from '../../validators/weighbridge.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { id } = req.query;
  await connectToDatabase();

  if (req.method === 'PUT') {
    try {
      const entry = await WeighbridgeEntry.findByIdAndUpdate(id, req.body, { new: true });
      if (!entry) return res.status(404).json({ error: 'Entry not found' });
      return res.status(200).json({ data: entry });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update weighbridge entry' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => {
  if (req.method === 'PUT') return validate(weighbridgeUpdateSchema, handler)(req, res);
  return handler(req, res);
});