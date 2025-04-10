import axios from 'axios';
import { API_AUTH } from "../constants/api.constants";

const axiosInstance = axios.create({
    baseURL: `${API_AUTH}`,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

// Interceptor để thêm token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
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
export const setupInterceptors = (navigate, setAccessToken) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const refreshToken = localStorage.getItem('refresh_token');
                    const response = await axios.post(
                        `${API_AUTH}/auth/refresh`,
                        {
                            refreshToken: refreshToken,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            }

                        }
                    );
                    setAccessToken(response.data.result.access_token);
                    originalRequest.headers["Authorization"] = `Bearer ${response.data.access_token}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token failed:", refreshError);
                    setAccessToken(null);
                    navigate("/login");
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
};

export default axiosInstance;
