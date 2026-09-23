import apiClient from "./apiClient";

export const getProgress = async () => {
  const { data } = await apiClient.get("/v1/progress");
  return data;
};

export const getProgressByRoadmap = async (roadmapId) => {
  const { data } = await apiClient.get(`/v1/progress/${roadmapId}`);
  return data;
};

export const completeTask = async (payload) => {
  const { data } = await apiClient.patch(
    "/v1/progress/complete-task",
    payload
  );
  return data;
};
