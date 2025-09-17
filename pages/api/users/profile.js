import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../config/database';

export default async function handler(req, res) {
  try {
    // Verify authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    const { db } = await connectToDatabase();
    const users = db.collection('users');

    if (req.method === 'GET') {
      // Get user profile
      const user = await users.findOne(
        { _id: decoded.userId },
        { projection: { password: 0 } } // Exclude password
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          preferences: user.preferences || {},
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      });

    } else if (req.method === 'PUT') {
      // Update user profile
      const { name, preferences } = req.body;
      const updateData = {};

      if (name) updateData.name = name.trim();
      if (preferences) updateData.preferences = preferences;
      updateData.updatedAt = new Date();

      const result = await users.updateOne(
        { _id: decoded.userId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Profile updated successfully' });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Profile API error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}
