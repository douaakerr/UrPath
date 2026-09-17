import Notification from "../models/Notification.js";

export const createNotification = async ({
  userId,
  type,
  title,
  message,
}) => {
  return Notification.create({
    user: userId,
    type,
    title,
    message,
  });
};

export const getUserNotifications = async (userId) => {
  return Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50);
};

export const markNotificationAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    {
      _id: notificationId,
      user: userId,
    },
    {
      read: true,
    },
    {
      new: true,
    }
  );
};

export const markAllNotificationsAsRead = async (userId) => {
  return Notification.updateMany(
    {
      user: userId,
      read: false,
    },
    {
      read: true,
    }
  );
};

export const deleteNotification = async (notificationId, userId) => {
  return Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });
};