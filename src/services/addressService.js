import axiosInstance from "../utils/axiosConfig";

export const getAddressUser = async () => {
    const response = await axiosInstance.get("/user-address/get");
    return response.data.result;
}

export const addAddressUser = async (formData) => {
    const response = await axiosInstance.post("/user-address/add", formData);
    return response.data.result;
}

export const updateAddressUser = async (formData) => {

    const response = await axiosInstance.put(`/user-address/update/${formData.id}`, formData);
    return response.data.result;
}

export const deleteAddressUser = async (id) => {
    const response = await axiosInstance.delete(`/user-address/delete/${id}`);
    return response.data.result;
}