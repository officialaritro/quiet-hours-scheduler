import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../config/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: new Date(),
      preferences: {
        theme: 'light',
        notifications: true,
        timeZone: 'UTC'
      }
    };

    const result = await users.insertOne(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.insertedId,
        email: newUser.email,
        name: newUser.name 
      },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '7d' }
    );

    // Return success response
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: result.insertedId,
        name: newUser.name,
        email: newUser.email,
        preferences: newUser.preferences
      }
    });

  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}