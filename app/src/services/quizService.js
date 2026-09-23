import apiClient from "./apiClient";

export const getQuizzes = async () => {
  const { data } = await apiClient.get("/v1/quizzes");
  return data;
};

export const getQuizById = async (quizId) => {
  const { data } = await apiClient.get(`/v1/quizzes/${quizId}`);
  return data;
};

export const submitQuiz = async (quizId, payload) => {
  const { data } = await apiClient.post(
    `/v1/quizzes/${quizId}/submit`,
    payload
  );
  return data;
};

export const generateQuiz = async (payload) => {
  const { data } = await apiClient.post("/v1/quizzes/generate", payload);
  return data;
};
