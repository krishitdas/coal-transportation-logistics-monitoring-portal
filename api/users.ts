import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../lib/mongodb.js';
import User from '../models/User.js';
import { withAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { withRoles } from '../middleware/roles.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  
  const path = req.url ? req.url.split('?')[0] : '';
  const segments = path.split('/').filter(Boolean);
  
  let id = req.query.id as string;
  if (!id) {
    const index = segments.findIndex(s => s === 'users');
    if (index !== -1 && index + 1 < segments.length) {
        id = segments[index + 1];
    }
  }

  if (id) {
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

  if (req.method === 'GET') {
    try {
      const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
      return res.status(200).json({ data: users });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => withRoles(['Admin'], handler)(req, res));
