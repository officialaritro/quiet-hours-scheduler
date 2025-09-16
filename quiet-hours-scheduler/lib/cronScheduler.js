import cron from 'node-cron';
import dbConnect from './dbConnect';
import StudyBlock from '../models/StudyBlock';
import User from '../models/User';
import { sendStudyBlockReminder } from './emailService';

class CronScheduler {
  constructor() {
    this.jobs = new Map();
  }

  async scheduleReminder(studyBlock) {
    try {
      await dbConnect();

      // Calculate reminder time (10 minutes before start)
      const startDateTime = new Date(`${studyBlock.date}T${studyBlock.startTime}`);
      const reminderTime = new Date(startDateTime.getTime() - 10 * 60 * 1000);
      
      // Don't schedule if reminder time is in the past
      if (reminderTime <= new Date()) {
        console.log('Reminder time is in the past, skipping schedule');
        return null;
      }

      // Check for existing job to prevent duplicates
      const existingJobId = `reminder_${studyBlock._id}`;
      if (this.jobs.has(existingJobId)) {
        console.log('Job already scheduled for this study block');
        return existingJobId;
      }

      // Create cron expression for the specific time
      const cronExpression = this.createCronExpression(reminderTime);
      
      const job = cron.schedule(cronExpression, async () => {
        try {
          console.log(`Executing reminder for study block: ${studyBlock._id}`);
          
          // Get user info
          const user = await User.findOne({ 
            $or: [
              { supabaseId: studyBlock.userId },
              { _id: studyBlock.userId }
            ]
          });

          if (!user) {
            console.error('User not found for study block:', studyBlock._id);
            return;
          }

          // Send email reminder
          await sendStudyBlockReminder(user, studyBlock);

          // Update study block to mark email as sent
          await StudyBlock.findByIdAndUpdate(studyBlock._id, {
            emailSent: true,
            updatedAt: new Date()
          });

          // Remove job from scheduler after execution
          this.jobs.delete(existingJobId);
          job.stop();

          console.log(`Reminder sent and job cleaned up for: ${studyBlock._id}`);

        } catch (error) {
          console.error('Error in cron job execution:', error);
        }
      }, {
        scheduled: false,
        timezone: 'UTC'
      });

      // Start the job
      job.start();
      
      // Store job reference
      this.jobs.set(existingJobId, job);

      // Update study block with job info
      await StudyBlock.findByIdAndUpdate(studyBlock._id, {
        reminderScheduled: true,
        cronJobId: existingJobId,
        updatedAt: new Date()
      });

      console.log(`Scheduled reminder for ${studyBlock.title} at ${reminderTime}`);
      return existingJobId;

    } catch (error) {
      console.error('Error scheduling reminder:', error);
      throw error;
    }
  }

  createCronExpression(dateTime) {
    const minute = dateTime.getUTCMinutes();
    const hour = dateTime.getUTCHours();
    const day = dateTime.getUTCDate();
    const month = dateTime.getUTCMonth() + 1;
    
    return `${minute} ${hour} ${day} ${month} *`;
  }

  cancelReminder(jobId) {
    const job = this.jobs.get(jobId);
    if (job) {
      job.stop();
      this.jobs.delete(jobId);
      console.log(`Cancelled job: ${jobId}`);
      return true;
    }
    return false;
  }

  // Clean up expired jobs (run daily)
  async cleanupExpiredJobs() {
    try {
      await dbConnect();
      
      const now = new Date();
      const expiredBlocks = await StudyBlock.find({
        date: { $lt: now.toISOString().split('T')[0] },
        reminderScheduled: true,
        cronJobId: { $exists: true }
      });

      for (const block of expiredBlocks) {
        this.cancelReminder(block.cronJobId);
        await StudyBlock.findByIdAndUpdate(block._id, {
          $unset: { cronJobId: 1 },
          reminderScheduled: false
        });
      }

      console.log(`Cleaned up ${expiredBlocks.length} expired jobs`);
    } catch (error) {
      console.error('Error cleaning up expired jobs:', error);
    }
  }
}

export const cronScheduler = new CronScheduler();

// Schedule daily cleanup at midnight UTC
cron.schedule('0 0 * * *', () => {
  cronScheduler.cleanupExpiredJobs();
});
