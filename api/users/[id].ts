import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import User from '../../models/User';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';
import { withRoles } from '../../middleware/roles';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { id } = req.query;
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const user = await User.findById(id).select('-passwordHash');
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json({ data: user });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => withRoles(['Admin'], handler)(req, res));
