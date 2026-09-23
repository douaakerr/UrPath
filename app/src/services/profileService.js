import apiClient from "./apiClient";

export const getProfile = async () => {
  const { data } = await apiClient.get("/v1/profile");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await apiClient.patch("/v1/profile", payload);
  return data;
};

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  const { data } = await apiClient.post("/v1/profile/photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const deleteProfilePhoto = async () => {
  const { data } = await apiClient.delete("/v1/profile/photo");
  return data;
};
