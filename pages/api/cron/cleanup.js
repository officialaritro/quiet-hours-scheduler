import { connectToDatabase } from "../../../config/database";

export default async function handler(req, res) {
  // Protect with CRON_SECRET so random users can’t trigger cleanup
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const now = new Date();

    const result = await db.collection("sessions").deleteMany({
      expiresAt: { $lt: now },
    });

    return res.status(200).json({
      success: true,
      message: `🧹 Cleanup complete. Removed ${result.deletedCount} expired sessions.`,
    });
  } catch (err) {
    console.error("❌ API Cleanup failed:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
