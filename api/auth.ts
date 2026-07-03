import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../lib/mongodb.js';
import User from '../models/User.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/auth.js';
import { withAuth, AuthenticatedRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';

async function loginHandler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();
    
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !user.active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    
    return res.status(200).json({ token, user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

const loginWithValidation = validate(loginSchema, loginHandler);

function logoutHandler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Stateless JWT: Just return success, client will clear token
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}

async function meHandler(req: AuthenticatedRequest, res: VercelResponse) {
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

const meWithAuth = withAuth(meHandler as any);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.url ? req.url.split('?')[0] : '';

  if (path.endsWith('/login')) {
    return loginWithValidation(req, res);
  }
  if (path.endsWith('/logout')) {
    return logoutHandler(req, res);
  }
  if (path.endsWith('/me')) {
    return meWithAuth(req, res);
  }

  return res.status(404).json({ error: 'Not Found' });
}
