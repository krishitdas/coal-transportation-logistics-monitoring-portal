import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb.js';
import User from '../../models/User.js';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();
    
    const user = await User.findById(req.user!.userId).select('-passwordHash');
    if (!user || !user.active) {
      return res.status(404).json({ error: 'User not found or inactive' });
    }
    
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    
    return res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAuth(handler);
