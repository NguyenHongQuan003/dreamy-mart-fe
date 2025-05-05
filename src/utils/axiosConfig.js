import axios from "axios";
import { API_AUTH } from "../constants/api.constants";
import { store } from "../redux/store";
import { clearAuth, setToken } from "../redux/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: `${API_AUTH}`,
});

// Interceptor để thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Tự động set Content-Type nếu chưa đặt
    if (!config.headers["Content-Type"]) {
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý refresh token khi token hết hạn
export const setupInterceptors = (navigate) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      localStorage.setItem("log", "Gọi refresh token");
      const isAuthUrl = originalRequest.url.includes("/auth/login");
      if (error.response?.status === 401 && !originalRequest._retry && !isAuthUrl) {
        originalRequest._retry = true;
        try {
          const refreshToken = store.getState().auth.refreshToken;
          const response = await axios.post(
            `${API_AUTH}/auth/refresh`,
            {
              refreshToken: refreshToken,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const access_token = response.data.result.access_token;
          store.dispatch(setToken(access_token));

          originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          store.dispatch(clearAuth());
          navigate("/login");
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
