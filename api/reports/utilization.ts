import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb.js';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    return res.status(200).json({ data: [] }); // placeholder
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);