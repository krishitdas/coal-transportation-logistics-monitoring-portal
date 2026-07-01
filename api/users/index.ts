import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb.js';
import User from '../../models/User.js';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth.js';
import { withRoles } from '../../middleware/roles.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
      return res.status(200).json({ data: users });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  // Not implementing POST in this snippet for brevity, seed script handles creation
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => withRoles(['Admin'], handler)(req, res));
