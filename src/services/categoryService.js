import axiosInstance from "../utils/axiosConfig";

// http://localhost:8080/api/v1/categories/all
export const getCategories = async () => {
    const response = await axiosInstance.get("/categories/all");
    return response.data.result;
}
