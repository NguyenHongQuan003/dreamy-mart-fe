import axiosInstance from "../utils/axiosConfig";

// delivery/get-all
export const getAllDelivery = async () => {
    const response = await axiosInstance.get("/delivery/get-all");
    return response.data;
};

// delivery/get-by-id
export const getDeliveryById = async (id) => {
    const response = await axiosInstance.get(`/delivery/get-by-id/${id}`);
    return response.data;
};

// delivery/delete
export const deleteDelivery = async (id) => {
    const response = await axiosInstance.delete(`/delivery/delete/${id}`);
    return response.data;
};

// delivery/update-status
export const updateDeliveryStatus = async (deliveryId, status, orderId) => {
    const response = await axiosInstance.put(`/delivery/update-status`, { deliveryId, status, orderId });
    return response.data;
};

export const refundPayment = async (orderId, userId, transId, totalAmount) => {
    const response = await axiosInstance.post("/payment/refund", { orderId, userId, transId, totalAmount });
    return response.data;
};

