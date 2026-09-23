import apiClient from "./apiClient";

export const sendLearningChat = async (payload) => {
  const { data } = await apiClient.post("/v1/ai/learning-chat", payload);
  return data;
};
