import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb.js';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    return res.status(200).json({ 
      data: [
        { date: '2026-06-25', count: 120 },
        { date: '2026-06-26', count: 140 },
        { date: '2026-06-27', count: 135 },
        { date: '2026-06-28', count: 150 },
        { date: '2026-06-29', count: 160 },
        { date: '2026-06-30', count: 145 },
        { date: '2026-07-01', count: 180 },
      ]
    });
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);