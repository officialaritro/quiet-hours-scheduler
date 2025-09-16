import dbConnect from '../../../lib/dbConnect';
import StudyBlock from '../../../models/StudyBlock';
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ message: 'Invalid authentication' });
  }

  try {
    if (req.method === 'DELETE') {
      const studyBlock = await StudyBlock.findOne({ _id: id, userId: user.id });
      
      if (!studyBlock) {
        return res.status(404).json({ message: 'Study block not found' });
      }

      await StudyBlock.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Study block deleted successfully' });

    } else if (req.method === 'PUT') {
      const { title, date, startTime, endTime, description } = req.body;
      
      const updatedBlock = await StudyBlock.findOneAndUpdate(
        { _id: id, userId: user.id },
        { title, date, startTime, endTime, description, emailSent: false },
        { new: true }
      );

      if (!updatedBlock) {
        return res.status(404).json({ message: 'Study block not found' });
      }

      return res.status(200).json({ studyBlock: updatedBlock });
    }

  } catch (error) {
    console.error('Study block API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}