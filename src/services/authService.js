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
    localStorage.setItem("roles", response.data.result.roles);
    return { flag: true, roles: response.data.result.roles };
  } catch (error) {
    if (error.response.status === 503) {
      console.error("Server auth not running");
    }
    return { flag: false, roles: [] };
  }
};

export const logout = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  const response = await axiosInstance.post(`/auth/logout`, { refreshToken });
  store.dispatch(clearAuth());
  localStorage.removeItem("roles");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/user-profile/user/profile");
  return response.data.result;
};

// /api/v1/auth/google/login
// {
//   "code": 1000,
//   "result": "http://localhost:8081/realms/springboot-ms-realm/protocol/openid-connect/auth?client_id=ecommerce_ms_app&redirect_uri=http://localhost:5173/callback&response_type=code&scope=openid%20email%20profile&kc_idp_hint=google"
// }

export const loginWithGoogle = async () => {
  const response = await axiosInstance.post("/auth/google/login");
  return response.data.result;
};
// /auth/facebook/login
// {
//   "code": 1000,
//   "result": "http://localhost:8081/realms/springboot-ms-realm/protocol/openid-connect/auth?client_id=ecommerce_ms_app&redirect_uri=http://localhost:5173/callback&response_type=code&scope=openid%20email%20profile&kc_idp_hint=facebook"
// }

export const loginWithFacebook = async () => {
  const response = await axiosInstance.post("/auth/facebook/login");
  return response.data.result;
};

export const getToken = async (code) => {
  const response = await axiosInstance.get(`/auth/token?code=${code}`);
  return response.data.result;
};







