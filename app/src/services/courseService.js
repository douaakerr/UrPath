import apiClient from "./apiClient";

export const getCourses = async (filters = {}) => {
  const { data } = await apiClient.get("/v1/courses", {
    params: filters,
  });
  return data;
};

export const getCourseById = async (courseId) => {
  const { data } = await apiClient.get(`/v1/courses/${courseId}`);
  return data;
};

export const getCourseProgress = async (courseId) => {
  const { data } = await apiClient.get(`/v1/courses/${courseId}/progress`);
  return data;
};

export const completeLesson = async (courseId, lessonId) => {
  const { data } = await apiClient.post(
    `/v1/courses/${courseId}/lessons/${lessonId}/complete`,
  );
  return data;
};

export const generateCourse = async (payload) => {
  const { data } = await apiClient.post("/v1/courses/generate", payload);
  return data;
};
