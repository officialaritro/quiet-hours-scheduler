import { supabase } from '../../../lib/supabase';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    await dbConnect();

    let dbUser = await User.findOne({ supabaseId: user.id });
    
    if (!dbUser) {
      dbUser = await User.create({
        supabaseId: user.id,
        email: user.email,
        name: user.email.split('@')[0]
      });
    }

    res.status(200).json({ user: dbUser });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}