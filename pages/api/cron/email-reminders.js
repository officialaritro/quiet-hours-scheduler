import dbConnect from '../../../lib/dbConnect';
import StudyBlock from '../../../models/StudyBlock';
import User from '../../../models/User';
import { sendStudyBlockReminder } from '../../../lib/emailService';

export default async function handler(req, res) {
  // Verify cron secret
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const now = new Date();
    const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

    // Find study blocks that need reminders (starting in ~10 minutes)
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
    const targetTime = tenMinutesFromNow.toTimeString().split(' ')[0].substring(0, 5);

    const blocksNeedingReminders = await StudyBlock.find({
      emailSent: false,
      date: today,
      startTime: { $gte: currentTime, $lte: targetTime }
    });

    let sentCount = 0;

    for (const block of blocksNeedingReminders) {
      try {
        const user = await User.findOne({ supabaseId: block.userId });
        
        if (!user || !user.emailNotifications) continue;

        const result = await sendStudyBlockReminder(user, block);
        
        if (result.success) {
          await StudyBlock.findByIdAndUpdate(block._id, { emailSent: true });
          sentCount++;
        }
      } catch (blockError) {
        console.error(`Error processing block ${block._id}:`, blockError);
      }
    }

    return res.status(200).json({
      success: true,
      sentCount,
      totalProcessed: blocksNeedingReminders.length
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}