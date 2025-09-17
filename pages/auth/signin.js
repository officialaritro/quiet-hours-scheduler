import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../config/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const users = db.collection('users');

    // Find user by email
    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        name: user.name 
      },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '7d' }
    );

    // Update last login
    await users.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Return success response
    res.status(200).json({
      message: 'Sign in successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences || {}
      }
    });

  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}