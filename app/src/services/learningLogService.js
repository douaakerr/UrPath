import apiClient from "./apiClient";

export const getLearningLogs = async () => {
  const { data } = await apiClient.get("/v1/learning-logs");
  return data;
};

export const getTodayLearningLogs = async () => {
  const { data } = await apiClient.get("/v1/learning-logs/today");
  return data;
};

export const createLearningLog = async (payload) => {
  const { data } = await apiClient.post("/v1/learning-logs", payload);
  return data;
};
