import axiosInstance from "../utils/axiosConfig";

export const register = async (formData) => {
  const userData = new FormData();
  userData.append("email", formData.email);
  userData.append("gender", formData.gender);
  userData.append("fullName", formData.fullname);
  userData.append("phone", formData.phone);
  userData.append("password", formData.password);
  userData.append("dateOfBirth", formData.dayOfBirth);

  const response = await axiosInstance.post(`/registration`, userData);
  return response.data;
};

export const generateOTP = async (email) => {
  try {
    const response = await axiosInstance.post("/otp/generate", { email });
    return response.data.message === "OTP generated successfully"
      ? true
      : false;
  } catch (error) {
    console.log("Error generating OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await axiosInstance.post("/otp/validate", { email, otp });
    console.log("Response service from verify OTP:", response);
    console.log("OTP verification service:", response.data.result.valid);
    return response.data.result.valid;
  } catch (error) {
    console.log("Error verifying OTP:", error);
    throw error;
  }
};

export const updateProfile = async (formData) => {
  const userData = new FormData();
  if (formData.avatar) {
    userData.append("avatar", formData.avatar);
  }
  userData.append("email", formData.email);
  userData.append("gender", formData.gender);
  userData.append("fullName", formData.fullName);
  userData.append("phone", formData.phone);
  userData.append("dateOfBirth", formData.dateOfBirth);

  const response = await axiosInstance.put(
    "/user-profile/user/update",
    userData
  );
  return response.data.result;
};

export const forgotPassword = async (email, newPassword) => {
  const response = await axiosInstance.post(
    "/user-profile/user/forgot-password",
    {
      email,
      newPassword,
    }
  );
  if (response.data.message === "Change password successfully") return true;
  return false;
};

export const checkEmail = async (email) => {
  const response = await axiosInstance.get(
    `/user-profile/user/verify-email/${email}`
  );
  console.log("response checkEmail", response);
  return response.data.result;
};


