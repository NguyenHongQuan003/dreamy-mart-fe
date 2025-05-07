import axiosInstance from "../utils/axiosConfig";

export const getCategories = async () => {
    const response = await axiosInstance.get("/categories/all");
    return response.data.result;
}
export const createCategory = async (name) => {
    const response = await axiosInstance.post("/categories/create", { name });
    return response.data.result;
}
// /categories/update/2
export const updateCategory = async (categoryId, name) => {
    const response = await axiosInstance.put(`/categories/update/${categoryId}`, { name });
    return response.data.result;
}


