import User from "../models/User.js";

export const updateUserActivity = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    lastActivityAt: new Date(),
  });
};