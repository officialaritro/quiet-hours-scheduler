import dbConnect from '../../../lib/dbConnect';
import StudyBlock from '../../../models/StudyBlock';
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  await dbConnect();

  // Authenticate user
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ message: 'Invalid authentication' });
  }

  try {
    if (req.method === 'GET') {
      const studyBlocks = await StudyBlock.find({ userId: user.id })
        .sort({ date: 1, startTime: 1 });
      return res.status(200).json({ studyBlocks });

    } else if (req.method === 'POST') {
      const { title, date, startTime, endTime, description } = req.body;

      if (!title || !date || !startTime || !endTime) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const studyBlock = await StudyBlock.create({
        userId: user.id,
        title,
        date,
        startTime,
        endTime,
        description: description || ''
      });

      return res.status(201).json({ studyBlock });
    }

  } catch (error) {
    console.error('Study blocks API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}