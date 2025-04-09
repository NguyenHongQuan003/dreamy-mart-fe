import axiosInstance from "../utils/axiosConfig";

export const login = async (username, password) => {
  const response = await axiosInstance.post("/auth/login", {
    username,
    password,
  });
  return response.data;
}

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/user-profile/user/profile");
  return response.data.result;
}


