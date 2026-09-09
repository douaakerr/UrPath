import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getLearningDomains = async () => {
  const { data } = await api.get("/v1/learning-domains");
  return data;
};
