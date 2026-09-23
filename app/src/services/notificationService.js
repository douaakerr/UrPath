import apiClient from "./apiClient";

export const getNotifications = async () => {
  const { data } = await apiClient.get("/v1/notification");
  return data;
};

export const markNotificationAsRead = async (id) => {
  const { data } = await apiClient.patch(`/v1/notification/${id}/read`);
  return data;
};

export const markAllNotificationsAsRead = async () => {
  const { data } = await apiClient.patch("/v1/notification/read-all");
  return data;
};

export const deleteNotification = async (id) => {
  const { data } = await apiClient.delete(`/v1/notification/${id}`);
  return data;
};
