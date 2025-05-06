import axiosInstance from "../utils/axiosConfig";

// http://localhost:8080/api/v1/categories/all
export const getCategories = async () => {
    const response = await axiosInstance.get("/categories/all");
    return response.data.result;
}
// http://localhost:8080/api/v1/categories/create
export const createCategory = async (categoryName) => {
    const response = await axiosInstance.post("/categories/create", { categoryName });
    return response.data.result;
}
// /categories/update/2
export const updateCategory = async (categoryId, categoryName) => {
    const response = await axiosInstance.put(`/categories/update/${categoryId}`, { categoryName });
    return response.data.result;
}


