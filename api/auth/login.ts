import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../lib/mongodb';
import User from '../../models/User';
import { validate } from '../../middleware/validate';
import { loginSchema } from '../../validators/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';

async function handler(req: VercelRequest, res: VercelResponse) {
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

export default validate(loginSchema, handler);
