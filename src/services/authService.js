import axiosInstance from "../utils/axiosConfig";
import { store } from "../redux/store";
import { setCredentials, clearAuth, setUser } from "../redux/slices/authSlice";

export const loadUserFromToken = async () => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return;
  }
  try {
    const userData = await getCurrentUser();
    if (userData) {
      store.dispatch(setUser(userData));
    }
  } catch (error) {
    console.error("Error loading user from token:", error);
  }
};

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      username,
      password,
    });
    // console.log("response", response.data);
    if (response.data.result) {
      const { access_token, refresh_token } = response.data.result;
      store.dispatch(
        setCredentials({
          user: null,
          access_token,
          refresh_token,
        })
      );
      const userData = await getCurrentUser();
      store.dispatch(setUser(userData));
    }
    return true;
  } catch (error) {
    if (error.response.status === 503) {
      console.error("Server auth not running");
    }
    return false;
  }
};

export const logout = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  const response = await axiosInstance.post(`/auth/logout`, { refreshToken });
  store.dispatch(clearAuth());
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/user-profile/user/profile");
  return response.data.result;
};
