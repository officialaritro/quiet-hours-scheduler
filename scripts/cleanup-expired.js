// scripts/cleanup-expired.js
import { connectToDatabase } from "../config/database.js";

async function cleanup() {
  const { db } = await connectToDatabase();

  try {
    // Example: remove expired sessions (if you have a sessions collection)
    const now = new Date();
    const result = await db.collection("sessions").deleteMany({
      expiresAt: { $lt: now },
    });

    console.log(`🧹 Cleanup complete. Removed ${result.deletedCount} expired sessions.`);
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
  } finally {
    process.exit(0);
  }
}

cleanup();
