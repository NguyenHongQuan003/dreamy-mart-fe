import axios from "axios";
const API_URL = "http://localhost:3000";

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

export const getCurrentUser = async (token) => {
  const response = await axios.get(`${API_URL}/tokens?token=${token}`);
  if (response.data.length > 0) {
    const tokenData = response.data[0];
    const userResponse = await axios.get(
      `${API_URL}/users/${tokenData.userId}`
    );
    return userResponse.data;
  }
  throw new Error("Invalid token");
};
