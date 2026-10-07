import apiClient from "./apiClient";

export const sendLearningChat = async (payload) => {
  const { data } = await apiClient.post("/v1/ai/learning-chat", payload);
  return data;
};

export const sendPdfChat = async ({ file, message }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("message", message);

  const { data } = await apiClient.post("/v1/ai/pdf-chat", formData);
  return data;
};
