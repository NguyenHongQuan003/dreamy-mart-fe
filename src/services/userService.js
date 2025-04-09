import axios from "axios";
import axiosInstance from "../utils/axiosConfig";

export const register = async (formData) => {
    const userData = new FormData();
    userData.append("email", formData.email);
    userData.append("avatar", formData.avatar);
    userData.append("gender", formData.gender);
    userData.append("fullName", formData.fullname);
    userData.append("phone", formData.phone);
    userData.append("password", formData.password);
    userData.append("dateOfBirth", formData.dayOfBirth);
    console.log("Form data in register service:", formData);
    console.log("userData in register service:", userData);

    const response = await axios.post(`http://localhost:8080/api/v1/registration`, { userData });
    console.log("Response service from register:", response);
    return response.data;
}

export const generateOTP = async (email) => {
    try {
        const response = await axiosInstance.post("/otp/generate", { email });
        console.log("Response service from generate OTP:", response);
        return response.data.message === "OTP generated successfully" ? true : false;
    } catch (error) {
        console.log("Error generating OTP:", error);
        throw error;
    }
}

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
}