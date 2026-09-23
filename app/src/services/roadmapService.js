import apiClient from "./apiClient";

export const getRoadmaps = async () => {
  const { data } = await apiClient.get("/v1/roadmaps");
  return data;
};

export const getRoadmapById = async (roadmapId) => {
  const { data } = await apiClient.get(`/v1/roadmaps/${roadmapId}`);
  return data;
};

export const generateRoadmapFromAssessment = async (assessmentId) => {
  const { data } = await apiClient.post(
    `/v1/roadmaps/from-assessment/${assessmentId}`
  );
  return data;
};
