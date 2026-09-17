import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { sendEmail } from "../utils/sendEmails.js";

const INACTIVITY_HOURS = 24;

export const checkInactiveUsers = async () => {
  try {
    const threshold = new Date(
      Date.now() - INACTIVITY_HOURS * 60 * 60 * 1000
    );

    const users = await User.find({
      lastActivityAt: { $lt: threshold },
    }).select("_id name email");

    for (const user of users) {
      const existingNotification = await Notification.findOne({
        user: user._id,
        type: "INACTIVITY",
        createdAt: { $gte: threshold },
      });

      if (existingNotification) continue;

      await Notification.create({
        user: user._id,
        type: "INACTIVITY",
        title: "We miss you!",
        message: "You haven't continued your learning journey recently.",
      });

      await sendEmail({
        to: user.email,
        subject: "We miss you at UrPath!",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>We miss you, ${user.name}!</h2>

            <p>
              You haven't continued your learning journey recently.
            </p>

            <p>
              Come back to UrPath and continue building your path.
            </p>

            <p>
              <strong>Develop yourself. Build your path.</strong>
            </p>
          </div>
        `,
      });
    }

    console.log(`Inactivity check completed: ${users.length} users checked`);
  } catch (error) {
    console.error("Inactivity job error:", error.message);
  }
};