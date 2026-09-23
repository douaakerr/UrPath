import apiClient from "./apiClient";

export const registerUser = async (userData) => {
  const { data } = await apiClient.post("/v1/auth/register", userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await apiClient.post("/v1/auth/login", credentials);
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await apiClient.post("/v1/auth/forgot-password", {
    email,
  });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await apiClient.post(
    `/v1/auth/reset-password/${token}`,
    {
      password,
      newPassword: password,
    }
  );
  return data;
};

export const logoutUser = async () => {
  const { data } = await apiClient.post("/v1/auth/logout");
  return data;
};

export const changePassword = async (passwordData) => {
  const { data } = await apiClient.put(
    "/v1/auth/change-password",
    passwordData
  );
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get("/v1/auth/me");
  return data;
};
