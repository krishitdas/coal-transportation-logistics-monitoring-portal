import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Stateless JWT: Just return success, client will clear token
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}
