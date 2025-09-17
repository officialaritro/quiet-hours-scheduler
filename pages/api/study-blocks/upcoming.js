import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../config/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    const { db } = await connectToDatabase();
    const studyBlocks = db.collection('study_blocks');

    // Get upcoming study blocks for the user
    const now = new Date();
    const upcomingBlocks = await studyBlocks.find({
      userId: decoded.userId,
      startTime: { $gte: now },
      status: { $ne: 'cancelled' }
    }).toArray();

    // Sort by start time
    upcomingBlocks.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    res.status(200).json({
      studyBlocks: upcomingBlocks.slice(0, 10) // Return next 10
    });

  } catch (error) {
    console.error('Upcoming study blocks error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}