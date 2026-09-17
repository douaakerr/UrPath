import cron from "node-cron";
import { checkInactiveUsers } from "./inactivityJob.js";

export const startJobs = () => {
  cron.schedule("0 * * * *", async () => {
    await checkInactiveUsers();
  });

  console.log("Background jobs started");
};