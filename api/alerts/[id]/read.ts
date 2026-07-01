import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../../lib/mongodb.js';
import Alert from '../../../models/Alert.js';
import { withAuth, AuthenticatedRequest } from '../../../middleware/auth.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { id } = req.query;
  await connectToDatabase();

  if (req.method === 'PUT') {
    try {
      const alert = await Alert.findByIdAndUpdate(id, { status: 'Acknowledged' }, { new: true });
      if (!alert) return res.status(404).json({ error: 'Alert not found' });
      return res.status(200).json({ data: alert });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update alert' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);