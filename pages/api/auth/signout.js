import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../config/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Verify and decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
      
      // Optional: Add token to blacklist in database
      const { db } = await connectToDatabase();
      const blacklist = db.collection('token_blacklist');
      
      await blacklist.insertOne({
        token,
        userId: decoded.userId,
        blacklistedAt: new Date(),
        expiresAt: new Date(decoded.exp * 1000)
      });
    }

    res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Sign out error:', error);
    res.status(200).json({ message: 'Signed out successfully' }); // Always return success
  }
}
