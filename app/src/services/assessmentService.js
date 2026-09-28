import apiClient from "./apiClient";

export const createAssessment = async (payload) => {
  const { data } = await apiClient.post("/v1/assessments", payload);
  return data;
};

export const submitAssessment = async (assessmentId, answers) => {
  const { data } = await apiClient.post(
    `/v1/assessments/${assessmentId}/submit`,
    { assessmentId, answers }
  );
  return data;
};
