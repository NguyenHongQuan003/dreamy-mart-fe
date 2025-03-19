import axios from "axios";
import { API_URL } from "../constants/api.constants";

export const login = async (email, password) => {
  const response = await axios.get(
    `${API_URL}/users?email=${email}&password=${password}`
  );
  if (response.data.length > 0) {
    const user = response.data[0];
    const token = `jwt_${user.id}_${Date.now()}`;
    axios.post(`${API_URL}/tokens`, { token, userId: user.id });
    return { user, token };
  }
  throw new Error("Invalid credentials");
};

// Có thể xảy ra lỗi không thể lấy thông tin user do cách dùng path param hoặc query params
// Khắc phục tạm thời bằng cách bắt lỗi
// nếu lỗi khi dùng path params thì dùng query params
// path param: API_URL/users/id (dùng khi id là string)
// query param: API_URL/users?id=id (dùng khi id là number)
export const getCurrentUser = async (token) => {
  const response = await axios.get(`${API_URL}/tokens?token=${token}`);
  if (response.data.length > 0) {
    const tokenData = response.data[0];
    try {
      const userResponse = await axios.get(
        `${API_URL}/users/${tokenData.userId}` // cách dùng path params
      );
      return userResponse.data;
    } catch (pathError) {
      pathError;
      const userResponse = await axios.get(
        `${API_URL}/users?id=${tokenData.userId}` // cách dùng query params
      );
      return userResponse.data[0];
    }
  }
  throw new Error("Invalid token");
};
