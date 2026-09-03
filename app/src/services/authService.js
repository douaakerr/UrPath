import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const authApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const registerUser = async (userData) => {
  const { data } = await authApi.post("/v1/auth/register", userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await authApi.post("/v1/auth/login", credentials);
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await authApi.post("/v1/auth/forgot-password", {
    email,
  });

  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await authApi.post(
    `/auth/reset-password/${token}`,
    {
      password,
    }
  );

  return data;
};

export const logoutUser = async () => {
  const { data } = await authApi.post("/users/logout");
  return data;
};

export const changePassword = async (passwordData) => {
  const { data } = await authApi.put(
    "v1/auth/change-password",
    passwordData
  );

  return data;
};